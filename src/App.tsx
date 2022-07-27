import "./App.css";
import GraphView from "./views/GraphView";
import { Graph, Vertex, Edge } from "./graph";
import ExperimentalGraphView, {
  Vertex as VertexView,
  Edge as EdgeView,
  VertexCreator,
  Menu
} from "./experiment/ExperimentalGraphView";
import { useEffect, useState } from "react";

const graphs = [
  new Graph([
    { x: 50, y: 50 },
    { x: 100, y: 50 },
    { x: 50, y: 100 },
    { x: 110, y: 100 },
    { x: 25, y: 150 },
    { x: 125, y: 150 }
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

graphs[1] = graphs[0].copy();
graphs[1].addEdge({ start: graphs[1].vertices[0], end: graphs[1].vertices[2] });

function App() {
  const [graph, setGraph] = useState(graphs[0]);
  const [edge, setEdge] = useState<Edge | null>(null);

  return (
    <div className="App">
      <div>
        <button onClick={() => setGraph(graphs[0].copy())}>1</button>
        <button onClick={() => setGraph(graphs[1].copy())}>2</button>
        <button
          onClick={() => {
            graphs[0] = graph.copy();
          }}
        >
          Copy to 1
        </button>
        <button
          onClick={() => {
            graphs[1] = graph.copy();
          }}
        >
          Copy to 2
        </button>
      </div>
      <ExperimentalGraphView>
        <Menu />
        <VertexCreator
          onClick={(vertex) => {
            graph.addVertex(vertex);
            setGraph(graph.copy());
          }}
        />

        {graph.edges.map((edge) => (
          <EdgeView
            key={`${edge.start.title} ${edge.end.title}`}
            {...edge}
            onClick={(edge) => {
              graph.deleteEdge(edge);
              setGraph(graph.copy());
            }}
          />
        ))}
        {graph.vertices.map((vertex) => (
          <VertexView
            key={vertex.title}
            {...vertex}
            onClick={(step, vertex) => {
              switch (step) {
                case 1:
                  if (!edge || !edge.start) {
                    setEdge({ ...edge, start: vertex });
                    return;
                  }
                  if (!edge.end) {
                    graph.addEdge({ ...edge, end: vertex });
                    setGraph(graph.copy());
                    setEdge(null);
                  }
                  break;
                case 2:
                  graph.deleteVertex(vertex);
                  setGraph(graph.copy());
                  break;
                case 4:
                  console.log(graph.dijkstrasAlgorithm(vertex.title));
                  //setGraph(graph.copy());
                  break;
              }
            }}
          />
        ))}
      </ExperimentalGraphView>
    </div>
  );
}

export default App;

/*
  TODO
  add VertexCreator
  add step state
  add Edges on vertex click
  
  fix rerender's canvas clear
*/
