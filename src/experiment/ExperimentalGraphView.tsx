import {
  useContext,
  createContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";

import { Vertex as VertexClass, Edge as EdgeClass } from "../graph";

const RenderingContext = createContext<Record<string, any>>({});

export function Text({ x, y, title = "", fontSize = 18 }) {
  const { canvasContext } = useContext(RenderingContext);
  useEffect(() => {
    if (!canvasContext) {
      return;
    }
    canvasContext.beginPath();
    canvasContext.fillStyle = "black";
    canvasContext.font = `${fontSize}px serif`;
    canvasContext.fillText(title, x - 5, y + 7);
    canvasContext.stroke();
  });
  return null;
}

export function Circle({ x, y, radius = 10, fillStyle = "lightblue" }) {
  const { canvasContext } = useContext(RenderingContext);
  useEffect(() => {
    if (!canvasContext) {
      return;
    }
    canvasContext.beginPath();
    canvasContext.arc(x, y, radius, 0, 2 * Math.PI, false);
    canvasContext.fillStyle = fillStyle;
    canvasContext.fill();
    canvasContext.lineWidth = 1;
    canvasContext.stroke();
  });
  return null;
}

export function Line({ start, end, fillStyle = "lightblue" }) {
  const { canvasContext } = useContext(RenderingContext);
  useEffect(() => {
    if (!canvasContext) {
      return;
    }
    canvasContext.beginPath();
    canvasContext.moveTo(start.x, start.y);
    canvasContext.lineTo(end.x, end.y);
    canvasContext.stroke();
  });
  return null;
}

export default function ExperimentalGraphView({ children }) {
  const canvasRef = useRef<HTMLCanvasElement>();
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D>(
    null
  );
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx2d = canvas.getContext("2d");
    setCanvasContext(ctx2d);
    return () => {
      console.log("Cleaning...");

      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    };
  });

  return (
    <RenderingContext.Provider
      value={{ canvasContext, canvas: canvasRef.current, step, setStep }}
    >
      <canvas className="canvas" ref={canvasRef} height="500" width="500" />
      {children}
    </RenderingContext.Provider>
  );
}

export function Vertex({
  x,
  y,
  title,
  onClick
}: {
  x: number;
  y: number;
  title?: string;
  onClick: (step: number, obj: VertexClass) => void;
}) {
  const { canvas, step } = useContext(RenderingContext);

  const handleClick = useCallback(
    (e) => {
      if (
        e.offsetX <= x + 10 &&
        e.offsetX >= x - 10 &&
        e.offsetY <= y + 10 &&
        e.offsetY >= y - 10
      ) {
        onClick(step, { title, x, y });
      }
    },
    [x, y, title, onClick, step]
  );

  useEffect(() => {
    canvas?.addEventListener("click", handleClick);
    return () => {
      canvas?.removeEventListener("click", handleClick);
    };
  }, [canvas, handleClick, step]);

  return (
    <>
      <Circle x={x} y={y} />
      <Text x={x} y={y} title={title} />
    </>
  );
}
//e.offsetY ===start.y +((e.offsetX - start.x) * (end.y - start.y)) / (end.x - start.x)

function compareWithError(value1, value2, error = 0.1) {
  const result = value1 - value2;
  return (result <= error && result >= 0) || (result >= -error && result <= 0);
}

export function Edge({
  start,
  end,
  onClick,
  length
}: {
  start: VertexClass;
  end: VertexClass;
  onClick: (edge: EdgeClass) => void;
  length: number;
}) {
  const { canvas, step } = useContext(RenderingContext);

  const handleClick = useCallback(
    (e) => {
      //console.log("start", start);
      //console.log("end", end);
      //console.log("e", e.offsetX + " " + e.offsetY);

      if (compareWithError(start.x, end.x)) {
        //console.log(1);
        if (
          e.offsetY <= Math.max(start.y, end.y) &&
          e.offsetY >= Math.min(start.y, end.y) &&
          compareWithError(start.x, e.offsetX, 1)
        ) {
          //console.log(1.1);
          onClick({ length, end, start });
        }
      } else if (compareWithError(start.y, end.y)) {
        //console.log(2);
        if (
          e.offsetX <= Math.max(start.x, end.x) &&
          e.offsetX >= Math.min(start.x, end.x) &&
          compareWithError(start.y, e.offsetY, 1)
        ) {
          //console.log(2.1);
          onClick({ length, end, start });
        }
      } else if (
        compareWithError(
          (e.offsetX - start.x) / (end.x - start.x),
          (e.offsetY - start.y) / (end.y - start.y)
        )
      ) {
        //console.log(3);
        onClick({ length, end, start });
      }
    },
    [start, end, onClick, length]
  );

  useEffect(() => {
    if (step === 3) {
      canvas?.addEventListener("click", handleClick);
      return () => {
        canvas?.removeEventListener("click", handleClick);
      };
    }
  }, [canvas, handleClick, step]);

  return (
    <>
      <Line start={start} end={end} />
      <Text
        x={(start.x + end.x) / 2}
        y={(start.y + end.y) / 2}
        title={length.toString()}
        fontSize={13}
      />
    </>
  );
}

export function VertexCreator({
  onClick
}: {
  onClick: (o: { x: number; y: number }) => void;
}) {
  const { canvas, step } = useContext(RenderingContext);

  const handleClick = useCallback(
    (e) => {
      onClick({ x: e.offsetX, y: e.offsetY });
    },
    [onClick]
  );

  useEffect(() => {
    if (step === 0) {
      canvas?.addEventListener("click", handleClick);
      return () => {
        canvas?.removeEventListener("click", handleClick);
      };
    }
  }, [canvas, handleClick, step]);

  return null;
}

export function Menu() {
  const { step, setStep } = useContext(RenderingContext);
  const menu = useMemo(
    () => [
      "Додавання вершин",
      "Додавання ребер",
      "Видалення вершин",
      "Видалення ребер"
    ],
    []
  );
  return (
    <div>
      <span>Step: {menu[step]}</span>
      <div>
        {menu.map((el, index) => (
          <button onClick={() => setStep(index)}>{el}</button>
        ))}
      </div>
    </div>
  );
}
