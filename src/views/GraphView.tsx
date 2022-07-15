import { useCallback, useEffect, useRef } from "react";

export default function GraphView({ vertices, edges }) {
  const canvasRef = useRef<HTMLCanvasElement>();
  const drawCircle = useCallback(
    (context, centerX, centerY, radius, title = "a") => {
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.fillStyle = "lightblue";
      context.fill();
      context.lineWidth = 1;
      context.strokeStyle = "blue";
      context.fillStyle = "black";
      context.font = "20px serif";
      context.fillText(title, centerX - 5, centerY + 7);
      context.stroke();
    },
    []
  );

  const drawLine = useCallback((context, start, end) => {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx2d = canvasRef.current.getContext("2d");
    ctx2d.clearRect(0, 0, canvas.width, canvas.height);
    if (edges) {
      edges.forEach((edge) => drawLine(ctx2d, edge.start, edge.end));
    }
    if (vertices) {
      vertices.forEach((vertex) =>
        drawCircle(ctx2d, vertex.x, vertex.y, 10, vertex.title)
      );
    }
  }, [vertices, canvasRef]);
  return <canvas className="canvas" ref={canvasRef} height="500" width="500" />;
}
