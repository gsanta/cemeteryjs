import { MatrixGraph } from '../matrix/MatrixGraph';
import * as _ from 'lodash';

export class LinesToGraphConverter {
    private graph: MatrixGraph;
    private lines: string[];
    private columns: number;
    private rows: number;
    private charachterToNameMap: {[key: string]: string};
    private vertexAdditinalData: {[key: number]: any};

    public parse(lines: string[], charachterToNameMap: {[key: string]: string}, vertexAdditinalData: {[key: number]: any}): MatrixGraph {
        this.lines = lines;
        this.charachterToNameMap = charachterToNameMap;
        this.vertexAdditinalData = vertexAdditinalData;
        this.columns = this.lines[0].length;
        this.rows = this.lines.length;
        this.graph = new MatrixGraph(this.columns, this.rows);
        this.initGraph();
        this.parseLines(lines);

        return this.graph;
    }

    private initGraph() {
        const vertices = this.lines[0].length * this.lines.length;
        const findCharacter = (index) => {
            const row = Math.floor(index / this.columns);
            const column = index % this.columns;

            return this.lines[row][column];
        };

        _.range(0, vertices).forEach(val => {
            const character = findCharacter(val);
            const name = this.charachterToNameMap[character];
            this.graph.addVertex(val, character, name);
        });

        this.parseLines(this.lines);
    }

    private parseLines(lines: string[]) {
        lines.forEach((line, index) => this.parseLine(line, index));
    }

    private parseLine(line: string, lineIndex: number) {
        line.split('').forEach((vertex, index) => this.addEdgesForVertex(lineIndex * line.length + index));
    }

    private addEdgesForVertex(vertex: number) {
        this.addLeftEdge(vertex);
        this.addTopEdge(vertex);
        this.addRightEdge(vertex);
        this.addBottomEdge(vertex);
    }

    private addLeftEdge(vertex: number) {
        const adjacentVertex = vertex - 1;
        if (this.hasNeighbourOnTheLeft(vertex) && !this.graph.hasEdgeBetween(vertex, adjacentVertex)) {
            this.graph.addEdge(vertex, adjacentVertex);
        }
    }

    private hasNeighbourOnTheLeft(vertex: number) {
        return vertex > 0 && vertex % this.columns !== 0;
    }

    private addBottomEdge(vertex: number) {
        const adjacentVertex = vertex + this.columns;
        if (
            this.hasNeighbourOnTheBottom(vertex) &&
            !this.graph.hasEdgeBetween(vertex, adjacentVertex) &&
            this.graph.getVertexValue(vertex).character === this.graph.getVertexValue(adjacentVertex).character
        ) {
            this.graph.addEdge(vertex, adjacentVertex);
        }
    }

    private hasNeighbourOnTheBottom(vertex: number) {
        return vertex < this.graph.size() - this.columns;
    }

    private addTopEdge(vertex: number) {
        const adjacentVertex = vertex - this.columns;
        if (
            this.hasNeighbourOnTheTop(vertex) &&
            !this.graph.hasEdgeBetween(vertex, adjacentVertex) &&
            this.graph.getVertexValue(vertex).character === this.graph.getVertexValue(adjacentVertex).character
        ) {
            this.graph.addEdge(vertex, adjacentVertex);
        }
    }

    private hasNeighbourOnTheTop(vertex: number) {
        return vertex >= this.columns;
    }

    private addRightEdge(vertex: number) {
        const adjacentVertex = vertex + 1;
        if (
            this.hasNeighbourOnTheRight(vertex) &&
            !this.graph.hasEdgeBetween(vertex, adjacentVertex) &&
            this.graph.getVertexValue(vertex).character === this.graph.getVertexValue(adjacentVertex).character
        ) {
            this.graph.addEdge(vertex, adjacentVertex);
        }
    }

    private hasNeighbourOnTheRight(vertex: number) {
        return vertex % this.columns !== this.columns - 1;
    }
}
