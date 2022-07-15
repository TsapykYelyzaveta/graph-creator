export class Graph {
  vertices: Vertex[];
  edges: Edge[];
  id: number;
  static newId = 0;
  constructor(vertices: Vertex[] = [], edges: Edge[] = []) {
    this.vertices = vertices;
    this.edges = edges;
    this.id = Graph.newId++;
  }

  addVertex(v: Vertex) {
    this.vertices.push(v);
  }

  addEdge(e: Edge) {
    this.edges.push(e);
  }

  setVertices(vertices: Vertex[]) {
    this.vertices = vertices;
  }

  setEdges(edges: Edge[]) {
    this.edges = edges;
  }
}

export interface Vertex {
  x: number;
  y: number;
  title: string;
}

export interface Edge {
  start: Vertex;
  end: Vertex;
  length?: number;
}
