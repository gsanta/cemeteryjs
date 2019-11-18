import { without } from './model/utils/Functions';

export class WorldMapGraph {
    private numberOfVertices = 0;
    private vertexValues: { [key: number]: string } = {};
    private vertices: number[] = [];
    private columns: number;
    private rows: number;
    private types: Set<string>;

    constructor(columns: number, rows: number) {
        this.columns = columns;
        this.rows = rows;
        this.types = new Set<string>([]);
    }

    hasType(type: string): boolean {
        return this.types.has(type);
    }

    getTypes(): string[] {
        return [...this.types.values()];
    }

    size() {
        return this.numberOfVertices;
    }

    getRows(): number {
        return this.rows;
    }

    getColumns(): number {
        return this.columns;
    }


    getVertexPositionInMatrix(vertex: number): {x: number, y: number} {
        const row = Math.floor(vertex / this.columns);
        const column = vertex % this.columns;

        return {
            x: column,
            y: row
        };
    }

    getVertexAtPosition(pos: {x: number, y: number}): number {
        const vertex = pos.y * this.columns + pos.x;

        if (this.hasVertex(vertex)) {
            return vertex;
        }

        return null;
    }

    getVertexValue(vertex: number): string {
        return this.vertexValues[vertex];
    }

    getVerticesByType(type: string): number[] {
        return this.vertices.filter(vertex => this.getVertexValue(vertex) === type);
    }

    addVertex(vertex: number, type: string) {

        this.vertexValues[vertex] = type;
        this.numberOfVertices += 1;

        this.vertices.push(vertex);
        this.types.add(type);
    }

    setVertexType(vertex: number, type: string) {
        this.vertexValues[vertex] = type;
    }

    getAllVertices(): number[] {
        return this.vertices;
    }

    private getAjacentEdges(vertex: number) {
        return [
            this.getTopNeighbour(vertex),
            this.getBottomNeighbour(vertex),
            this.getLeftNeighbour(vertex),
            this.getRightNeighbour(vertex)
        ].filter(vert => vert !== null);
    }

    public hasVertex(vertex: number): boolean {
        return this.vertices.indexOf(vertex) !== -1;
    }

    public hasEdgeBetween(v1: number, v2: number) {
        return this.vertices.includes(v1) && this.vertices.includes(v2);
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
        const leftNeighbourIndex = vertex - 1;

        if (this.hasVertex(leftNeighbourIndex) && leftNeighbourIndex % this.columns !== this.columns - 1) {
            return leftNeighbourIndex;
        }

        return null;
    }

    public getRightNeighbour(vertex: number): number {
        const rightNeighbourIndex = vertex + 1;

        if (this.hasVertex(rightNeighbourIndex) && rightNeighbourIndex % this.columns !== 0) {
            return rightNeighbourIndex;
        }

        return null;
    }

    public getGraphForVertices(vertices: number[]): WorldMapGraph {
        const graph = new WorldMapGraph(this.columns, this.rows);

        vertices.forEach(vertex => graph.addVertex(vertex, this.getVertexValue(vertex)));

        return graph;
    }

    /*
     * Reduces the graph into subgraphs, where each graph consists of only one type
     * and where each graph is a `connected-component`.
     */
    public getConnectedComponentGraphs(): WorldMapGraph[] {
        const connectedComponents = this.findConnectedComponents();

        return connectedComponents.map(component => this.getReducedGraphForVertices(component));
    }

    getReducedGraphForTypes(types: string[]): WorldMapGraph {
        const graph = new WorldMapGraph(this.columns, this.rows);

        this.vertices
            .filter(vertex => types.includes(this.getVertexValue(vertex)))
            .forEach(vertex => graph.addVertex(vertex, this.getVertexValue(vertex)));

        return graph;
    }

    private findConnectedComponents(): number[][] {
        const connectedComps: Set<number>[] = [];

        let actComp = new Set<number>();
        this.BFS((vertex, newRoot) => {
            if (newRoot) {
                connectedComps.push(actComp);
                actComp = new Set<number>();
            }
            actComp.add(vertex);
        });

        connectedComps.push(actComp);

        return connectedComps.map(set => Array.from(set));
    }

    /*
     * returns with a graph of the same extent (same column and row number), but
     * containing only the vertices passed as the `vertices` parameter and the edges between
     * those vertices.
     */
    private getReducedGraphForVertices(vertices: number[]): WorldMapGraph {
        const graph = new WorldMapGraph(this.columns, this.rows);

        vertices.forEach(vertex => graph.addVertex(vertex, this.getVertexValue(vertex)));

        return graph;
    }

    private BFS(callback: (vertex: number, isNewRoot: boolean) => void) {
        let allVertices = this.getAllVertices();
        const queue = [allVertices[0]];
        const visited: {[key: number]: boolean} = {
            [allVertices[0]]: true
        };

        let isNewRoot = false;
        while (allVertices.length > 0) {
            while (queue.length > 0) {

                const vertex = queue.shift();

                allVertices = without(allVertices, vertex);
                callback(vertex, isNewRoot);
                isNewRoot = false;

                const adjacentEdges = this.getAjacentEdges(vertex);

                const notVisitedAdjacentEdges = adjacentEdges.filter(edge =>  visited[edge] !== true);
                if (notVisitedAdjacentEdges.length === 0) {
                    continue;
                }

                for (let i = 0; i < notVisitedAdjacentEdges.length; i++) {
                    queue.push(notVisitedAdjacentEdges[i]);
                    visited[notVisitedAdjacentEdges[i]] = true;
                }
            }

            if (allVertices.length > 0) {
                queue.push(allVertices[0]);
                isNewRoot = true;
            }
        }

    }
}
