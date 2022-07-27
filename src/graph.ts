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

  formAdjacencyMatrix() {
    const adjacencyMatrix: any = {};

    this.edges.forEach((edge) => {
      if (!adjacencyMatrix[edge.start.title]) {
        adjacencyMatrix[edge.start.title] = {};
      }
      if (!adjacencyMatrix[edge.end.title]) {
        adjacencyMatrix[edge.end.title] = {};
      }

      adjacencyMatrix[edge.start.title][edge.end.title] = edge.length;

      adjacencyMatrix[edge.end.title][edge.start.title] = edge.length;
    });
    return adjacencyMatrix;
  }
  dijkstrasAlgorithm(start: string) {
    const D: { [key: string]: number } = {};
    const adjacencyMatrix = this.formAdjacencyMatrix();

    const visit: { [key: string]: boolean } = {};

    this.vertices.forEach((v) => {
      D[v.title] = adjacencyMatrix[start][v.title] ?? Infinity;
      visit[v.title] = false;
    });
    D[start] = 0;
    visit[start] = true;
    let current: string;
    let min: number;
    do {
      current = null;
      min = Infinity;

      this.vertices.forEach((v) => {
        if (D[v.title] < min && !visit[v.title]) {
          min = D[v.title];
          current = v.title;
        }
      });
      visit[current] = true;
      if (current === null) {
        return D;
      }
      this.edges.forEach((edge) => {
        if (
          edge.start.title === current &&
          !visit[edge.end.title] &&
          D[current] + edge.length < D[edge.end.title]
        ) {
          D[edge.end.title] = D[current] + edge.length;
        }
        if (
          edge.end.title === current &&
          !visit[edge.start.title] &&
          D[current] + edge.length < D[edge.start.title]
        ) {
          D[edge.start.title] = D[current] + edge.length;
        }
      });
    } while (current !== null);
    return D;
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
