import { WorldMapGraph } from '../../../types/WorldMapGraph';
import { PolygonVertex, Direction } from './PolygonVertexListFinder';
import { Point } from '../../../../geometry/shapes/Point';
import { Polygon } from '../../../../geometry/shapes/Polygon';

export class VertexListToPolygonConverter {
    convert(vertexes: PolygonVertex[], graph: WorldMapGraph): Polygon {
        const origVertexes = vertexes;
        vertexes = [...vertexes];

        const points: Point[] = [ ];

        while(vertexes.length > 0) {
            const vertex = vertexes.shift();

            if (vertex.isConvex) {
                let vertexPosition = graph.getNodePositionInMatrix(vertex.nodeIndex);
                
                let x = this.getX(vertex.nodeIndex, vertexPosition, graph);
                let y = this.getY(vertex.nodeIndex, vertexPosition, graph);
    
                const newPoint = new Point(x, y);
                points.push(newPoint);
            } else {
                points.push(undefined);
            }
        }
        this.calcConcavePoints(points, origVertexes, graph);

        return new Polygon(points);
    }

    private calcConcavePoints(points: Point[], vertexes: PolygonVertex[], graph: WorldMapGraph) {
        const prevIndex = (index: number) => index === 0 ? vertexes.length - 1 : index - 1;
        const nextIndex = (index: number) => index === vertexes.length - 1 ? 0 : index + 1;

        for (let i = 0; i < points.length; i++) {
            if (points[i] === undefined) {

                const x = this.getX(vertexes[i].nodeIndex, graph.getNodePositionInMatrix(vertexes[i].nodeIndex), graph);
                const y = this.getY(vertexes[i].nodeIndex, graph.getNodePositionInMatrix(vertexes[i].nodeIndex), graph);

                points[i] = new Point(x, y);

                if (vertexes[prevIndex(i)].isConvex) {
                    this.setConcaveCoordinateBasedOnPrevNeighbour(i, prevIndex(i), vertexes, points);
                }

                if (vertexes[nextIndex(i)].isConvex) {
                    this.setConcaveCoordinateBasedOnNextNeighbour(i, nextIndex(i), vertexes, points);
                }
            }
        }
    }

    private setConcaveCoordinateBasedOnPrevNeighbour(index: number, convexNeighbourIndex: number, vertexes: PolygonVertex[], points: Point[]) {
        let direction = vertexes[index].direction;

        this.setConcaveCoordinateBasedOnConvexNeighbour(index, convexNeighbourIndex, direction, points);
    }

    private setConcaveCoordinateBasedOnNextNeighbour(index: number, convexNeighbourIndex: number, vertexes: PolygonVertex[], points: Point[]) {
        let direction = vertexes[convexNeighbourIndex].direction;

        this.setConcaveCoordinateBasedOnConvexNeighbour(index, convexNeighbourIndex, direction, points);
    }

    private setConcaveCoordinateBasedOnConvexNeighbour(index: number, convexNeighbourIndex: number, direction: Direction, points: Point[]) {
        switch(direction) {
            case Direction.UP:
            case Direction.DOWN:
                points[index].x = points[convexNeighbourIndex].x; 
                break;

            case Direction.LEFT:
            case Direction.RIGHT:
                points[index].y = points[convexNeighbourIndex].y; 
                break;
        }
    }

    private getX(vertex: number, vertexPosition: {x: number, y: number}, graph: WorldMapGraph): number {
        if (graph.getLeftNeighbour(vertex) === null) {
            return vertexPosition.x;
        } else {
            return vertexPosition.x + 1;
        }
    }

    private getY(vertex: number, vertexPosition: {x: number, y: number}, graph: WorldMapGraph): number {
        if (graph.getTopNeighbour(vertex) === null) {
            return vertexPosition.y;
        } else {
            return vertexPosition.y + 1;
        }
    }
}