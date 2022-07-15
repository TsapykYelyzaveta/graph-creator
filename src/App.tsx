import "./App.css";
import GraphView from "./views/GraphView";
import { Graph } from "./graph";
import { useCallback, useState } from "react";

const graphs = [
  new Graph([
    { x: 50, y: 50, title: "a" },
    { x: 100, y: 50, title: "b" },
    { x: 50, y: 100, title: "c" },
    { x: 100, y: 100, title: "d" },
    { x: 25, y: 150, title: "e" },
    { x: 125, y: 150, title: "f" }
  ]),
  new Graph([
    { x: 150, y: 50, title: "a" },
    { x: 200, y: 50, title: "b" },
    { x: 150, y: 50, title: "c" },
    { x: 200, y: 150, title: "d" },
    { x: 125, y: 300, title: "e" },
    { x: 225, y: 150, title: "f" },
    { x: 225, y: 200, title: "g" }
  ])
];

graphs[0].setEdges([
  { start: graphs[0].vertices[0], end: graphs[0].vertices[1] },
  { start: graphs[0].vertices[1], end: graphs[0].vertices[2] },
  { start: graphs[0].vertices[2], end: graphs[0].vertices[5] },
  { start: graphs[0].vertices[2], end: graphs[0].vertices[4] },
  { start: graphs[0].vertices[3], end: graphs[0].vertices[1] },
  { start: graphs[0].vertices[3], end: graphs[0].vertices[5] },
  { start: graphs[0].vertices[3], end: graphs[0].vertices[4] }
]);

graphs[1].setEdges([
  { start: graphs[1].vertices[0], end: graphs[1].vertices[1] },
  { start: graphs[1].vertices[1], end: graphs[1].vertices[2] },
  { start: graphs[1].vertices[2], end: graphs[1].vertices[5] },
  { start: graphs[1].vertices[2], end: graphs[1].vertices[4] },
  { start: graphs[1].vertices[3], end: graphs[1].vertices[1] },
  { start: graphs[1].vertices[3], end: graphs[1].vertices[5] },
  { start: graphs[1].vertices[3], end: graphs[1].vertices[2] },
  { start: graphs[1].vertices[5], end: graphs[1].vertices[6] }
]);

function App() {
  const [graph, setGraph] = useState(graphs[0]);

  const toggleGraph = useCallback(() => {
    console.log(graph.id);

    if (graph.id === 0) {
      setGraph(graphs[1]);
    } else {
      setGraph(graphs[0]);
    }
  }, [graph]);

  return (
    <div className="App">
      <GraphView vertices={graph.vertices} edges={graph.edges} />
      <button onClick={toggleGraph}>Change</button>
    </div>
  );
}

export default App;
