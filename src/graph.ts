const alpha = Array.from(Array(26)).map((e, i) => i + 65);

export class Graph {
  vertices: Vertex[];
  edges: Edge[];
  id: number;
  static newId = 0;
  alphabet: string[];
  constructor(
    vertices: Vertex[] = [],
    edges: Edge[] = [],
    id: number = Graph.newId++
  ) {
    this.alphabet = alpha.map((x) => String.fromCharCode(x).toLowerCase());
    this.vertices = [];
    this.edges = [];
    vertices.forEach((v) => this.addVertex(v));
    edges.forEach((e) => this.addEdge(e));
    this.id = id;
  }

  addVertex(v: Vertex) {
    if (v.title) {
      const index = this.alphabet.findIndex((a) => v.title === a);
      this.alphabet.splice(index, 1);
      this.vertices.push(v);
    } else {
      const result = { ...v, title: this.alphabet[0] };
      const index = this.alphabet.findIndex((a) => result.title === a);
      this.alphabet.splice(index, 1);
      this.vertices.push(result);
    }
  }

  addEdge(e: { start: Vertex; end: Vertex }) {
    if (
      !this.edges.find(
        (edge) =>
          e.start.title === edge.start.title && e.end.title === edge.end.title
      )
    ) {
      this.edges.push({
        ...e,
        length: Math.round(
          Math.sqrt(
            Math.pow(e.end.x - e.start.x, 2) + Math.pow(e.end.y - e.start.y, 2)
          )
        )
      });
    }
  }

  deleteVertex(v: Vertex): boolean {
    const index = this.vertices.findIndex((vertex) => vertex.title === v.title);
    if (index !== -1) {
      [...this.edges].forEach((edge) => {
        console.log("edge", edge);
        if (edge.start.title === v.title || edge.end.title === v.title) {
          this.deleteEdge(edge);
        }
      });
      this.vertices.splice(index, 1);
      return true;
    }
    return false;
  }

  deleteEdge(e: Edge): boolean {
    const index = this.edges.findIndex(
      (edge) =>
        edge.start.title === e.start.title && edge.end.title === e.end.title
    );
    if (index !== -1) {
      console.log("Delete", e);
      this.edges.splice(index, 1);
      return true;
    }

    return false;
  }

  setVertices(vertices: Vertex[]) {
    this.vertices = vertices;
  }

  setEdges(edges: { start: Vertex; end: Vertex }[]) {
    edges.forEach((e) => this.addEdge(e));
  }

  copy() {
    return new Graph([...this.vertices], [...this.edges], this.id);
  }
}

export interface Vertex {
  x: number;
  y: number;
  title?: string;
}

export interface Edge {
  start: Vertex;
  end: Vertex;
  length: number;
}
