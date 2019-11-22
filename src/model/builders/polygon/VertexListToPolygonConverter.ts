import { WorldMapGraph } from '../../../WorldMapGraph';
import { Polygon, Point } from '@nightshifts.inc/geometry';

export class VertexListToPolygonConverter {
    private graph: WorldMapGraph;

    constructor(graph: WorldMapGraph) {
        this.graph = graph;
    }

    convert(vertexes: number[]): Polygon {
        const points: Point[] = [];

        while(vertexes.length > 0) {
            const vertex = vertexes.shift();
            let vertexPosition = this.graph.getVertexPositionInMatrix(vertex);
            
            let x = this.getX(vertex, vertexPosition);
            let y = this.getY(vertex, vertexPosition);

            points.push(new Point(x, y));
        }

        return new Polygon(points);
    }

    private getX(vertex: number, vertexPosition: {x: number, y: number}): number {
        if (this.graph.getLeftNeighbour(vertex) === null) {
            return vertexPosition.x;
        } else {
            return vertexPosition.x + 1;
        }
    }

    private getY(vertex: number, vertexPosition: {x: number, y: number}): number {
        if (this.graph.getTopNeighbour(vertex) === null) {
            return vertexPosition.y;
        } else {
            return vertexPosition.y + 1;
        }
    }
}