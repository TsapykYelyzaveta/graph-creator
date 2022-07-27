import {
  createContext,
  FC,
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useRef
} from "react";
import { Graph, Vertex } from "./graph";

interface CanvasContextValue {
  canvas: HTMLCanvasElement;
  graph: Graph;
}

const GraphRenderingContext = createContext<CanvasContextValue>(null);

export const GraphRenderingContextProvider: FC = ({ children }) => {
  const canvasRef = useRef();
  const graphInstance = useMemo(() => new Graph(), []);

  useEffect(() => {
    // canvasRef.current.clear();
  }, []);

  return (
    <Fragment>
      <GraphRenderingContext.Provider
        value={{
          canvas: canvasRef.current,
          graph: graphInstance
        }}
      >
        {children}
      </GraphRenderingContext.Provider>

      <canvas
        onClick={(e) => {
          graphInstance.addVertex({ x: e.pageX, y: e.pageY });
        }}
        ref={canvasRef}
      />
    </Fragment>
  );
};

let verticleId = 0;

const Verticle = (vertex: Vertex) => {
  //const idRef = useRef(++verticleId).current;
  const { graph, canvas } = useContext(GraphRenderingContext);

  useEffect(() => {
    graph.addVertex(vertex);

    const ctx2d = canvas.getContext("2d");

    // ctx2d.fillStyle = 'red';
    // ctx2d.drawCircle(x, y, 10);
  }, [graph]);

  return null;
};

export const GraphApp: FC = () => {
  const verticies = [];

  return (
    <GraphRenderingContextProvider>
      {verticies.map(({ x, y }) => (
        <Verticle x={x} y={y} />
      ))}
    </GraphRenderingContextProvider>
  );
};
