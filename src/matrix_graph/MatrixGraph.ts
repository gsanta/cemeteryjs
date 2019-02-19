import * as _ from 'lodash';

export interface MatrixGraphVertexValue {
    character: string;
    name: string;
    additionalData?: any;
}

export class MatrixGraph {
    private numberOfVertices = 0;
    private adjacencyList: { [key: number]: number[] } = {};
    private vertexValues: { [key: number]: MatrixGraphVertexValue } = {};
    private edges: [number, number][] = [];
    private vertices: number[] = [];
    private columns: number;
    private rows: number;
    private characters: Set<string>;

    constructor(columns: number, rows: number) {
        this.columns = columns;
        this.rows = rows;
        this.characters = new Set<string>([]);
    }

    public getCharacters(): string[] {
        return [...this.characters.values()];
    }

    public size() {
        return this.numberOfVertices;
    }

    public getRows(): number {
        return this.rows;
    }

    public getColumns(): number {
        return this.columns;
    }


    public getVertexPositionInMatrix(vertex: number): {x: number, y: number} {
        const row = Math.floor(vertex / this.columns);
        const column = vertex % this.columns;

        return {
            x: column,
            y: row
        };
    }

    public getVertexAtPosition(pos: {x: number, y: number}): number {
        const vertex = pos.y * this.columns + pos.x;

        if (this.hasVertex(vertex)) {
            return vertex;
        }

        return null;
    }

    public getVertexValue(vertex: number): MatrixGraphVertexValue {
        return this.vertexValues[vertex];
    }

    public addNextVertex(vertex: number, vertexValue: MatrixGraphVertexValue) {
        this.adjacencyList[vertex] = [];
        this.vertexValues[vertex] = vertexValue;
        this.numberOfVertices += 1;
        this.vertices.push(vertex);
        this.characters.add(vertexValue.character);
    }

    public addEdge(v, w) {
        this.adjacencyList[v].push(w);
        this.adjacencyList[w].push(v);
        this.edges.push([v, w]);
    }

    public getAllEdges(): [number, number][] {
        return this.edges;
    }

    public getAllVertices(): number[] {
        return this.vertices;
    }

    public getAjacentEdges(vertex: number) {
        return this.adjacencyList[vertex];
    }

    public hasVertex(vertex: number): boolean {
        return this.vertices.indexOf(vertex) !== -1;
    }

    public hasEdgeBetween(v1: number, v2: number) {
        return this.adjacencyList[v1].indexOf(v2) !== -1;
    }

    public getTopNeighbour(vertex: number): number {
        const topNeighbourIndex = vertex - this.columns;

        return this.vertices.indexOf(topNeighbourIndex) !== -1 ? topNeighbourIndex : null;
    }

    public getBottomNeighbour(vertex: number): number {
        const topNeighbourIndex = vertex + this.columns;

        return this.vertices.indexOf(topNeighbourIndex) !== -1 ? topNeighbourIndex : null;
    }

    public getLeftNeighbour(vertex: number): number {
        const topNeighbourIndex = vertex - 1;

        return this.vertices.indexOf(topNeighbourIndex) !== -1 ? topNeighbourIndex : null;
    }

    public getRightNeighbour(vertex: number): number {
        const topNeighbourIndex = vertex + 1;

        return this.vertices.indexOf(topNeighbourIndex) !== -1 ? topNeighbourIndex : null;
    }

    public getGraphForVertices(vertices: number[]): MatrixGraph {
        const graph = new MatrixGraph(this.columns, this.rows);

        vertices.forEach(vertex => graph.addNextVertex(vertex, this.getVertexValue(vertex)));
        graph.getAllVertices().forEach(vertex => {
            const neighbours = this.getAjacentEdges(vertex);

            neighbours.forEach(neighbour => {
                if (graph.hasVertex(neighbour)) {
                    graph.addEdge(vertex, neighbour);
                }
            });
        });

        return graph;
    }

    public getGraphForVertexValue(val: string): MatrixGraph {
        const graph = new MatrixGraph(this.columns, this.rows);
        this.getAllVertices()
            .filter(vertex => this.getVertexValue(vertex).character === val)
            .forEach(vertex => graph.addNextVertex(vertex, this.getVertexValue(vertex)));

        graph.getAllVertices().forEach(vertex => {

            const neighbours = this.getAjacentEdges(vertex);

            neighbours.forEach(neighbour => {
                if (this.getVertexValue(neighbour).character === val && !graph.hasEdgeBetween(vertex, neighbour)) {
                    graph.addEdge(vertex, neighbour);
                }
            });
        });

        return graph;
    }

    public BFS(callback: (vertex: number, isNewRoot: boolean) => void) {
        let allVertices = this.getAllVertices();
        const queue = [allVertices[0]];
        const visited: number[] = [];

        let isNewRoot = false;

        while (allVertices.length > 0) {
            while (queue.length > 0) {

                const vertex = queue.shift();
                visited.push(vertex);
                allVertices = _.without(allVertices, vertex);
                callback(vertex, isNewRoot);
                isNewRoot = false;

                let notVisitedNeighbours = this.getAjacentEdges(vertex);
                notVisitedNeighbours = _.without(notVisitedNeighbours, ...visited);
                if (notVisitedNeighbours.length === 0) {
                    continue;
                }

                for (let i = 0; i < notVisitedNeighbours.length; i++) {
                    queue.push(notVisitedNeighbours[i]);
                }
            }

            if (allVertices.length > 0) {
                queue.push(allVertices[0]);
                isNewRoot = true;
            }
        }

    }

    public findConnectedComponentsForCharacter(character: string): number[][] {
        const reducedGraph = this.getGraphForVertexValue(character);

        const connectedComps: Set<number>[] = [];

        let actComp = new Set();
        reducedGraph.BFS((vertex, newRoot) => {
            if (newRoot) {
                connectedComps.push(actComp);
                actComp = new Set();
            }
            actComp.add(vertex);
        });

        connectedComps.push(actComp);

        return connectedComps.map(set => Array.from(set));
    }
}
