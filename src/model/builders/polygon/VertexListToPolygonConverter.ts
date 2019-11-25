import { WorldMapGraph } from '../../../WorldMapGraph';
import { Polygon, Point } from '@nightshifts.inc/geometry';
import { PolygonVertex, Direction } from './PolygonVertexListFinder';

enum LineOrientation {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical'
}

namespace LineOrientation {
    export function getOppositeOrientation(orientation: LineOrientation) {
        return orientation === LineOrientation.HORIZONTAL ? LineOrientation.VERTICAL : LineOrientation.HORIZONTAL;
    }
}

export class VertexListToPolygonConverter {
    convert(vertexes: PolygonVertex[], graph: WorldMapGraph): Polygon {
        const origVertexes = vertexes;
        vertexes = [...vertexes];

        // const firstPosition = graph.getNodePositionInMatrix(vertexes[0]);
        // const secondPosition = graph.getNodePositionInMatrix(vertexes[1]);

        // let orientation = firstPosition.x === secondPosition.x ? LineOrientation.VERTICAL : LineOrientation.HORIZONTAL;

        // const points: Point[] = [ this.getFirstPoint(vertexes, graph) ];
        const points: Point[] = [ ];

        // let prevPoint = points[0];

        // vertexes.shift();
        while(vertexes.length > 0) {
            const vertex = vertexes.shift();

            if (vertex.isConvex) {
                let vertexPosition = graph.getNodePositionInMatrix(vertex.nodeIndex);
                
                let x = this.getX(vertex.nodeIndex, vertexPosition, graph);
                let y = this.getY(vertex.nodeIndex, vertexPosition, graph);
    
                // if (orientation === LineOrientation.HORIZONTAL) {
                //     x = this.getX(vertex, vertexPosition, graph);
                // } else {
                //     y = this.getY(vertex, vertexPosition, graph);
                // }
                const newPoint = new Point(x, y);
                points.push(newPoint);
            } else {
                points.push(undefined);
            }

            // prevPoint = newPoint;
            // orientation = LineOrientation.getOppositeOrientation(orientation);
        }
        this.calcConcavePoints(points, origVertexes, graph);

        return new Polygon(points);
    }

    private calcConcavePoints(points: Point[], vertexes: PolygonVertex[], graph: WorldMapGraph) {
 
        for (let i = 0; i < points.length; i++) {
            if (points[i] === undefined) {

                let x: number, y: number;
                let convexNeighbourIndex = this.getConvexNeighbourIndex(i, vertexes);
                let direction: Direction;

                if (convexNeighbourIndex > i) {
                    direction = vertexes[convexNeighbourIndex].direction;
                } else {
                    direction = vertexes[i].direction;
                }

                switch(direction) {
                    case Direction.UP:
                    case Direction.DOWN:
                        x = points[this.getConvexNeighbourIndex(i, vertexes)].x;
                        y = this.getY(vertexes[i].nodeIndex, graph.getNodePositionInMatrix(vertexes[i].nodeIndex), graph);
                        break;

                    case Direction.LEFT:
                    case Direction.RIGHT:
                        y = points[this.getConvexNeighbourIndex(i, vertexes)].y;
                        x = this.getX(vertexes[i].nodeIndex, graph.getNodePositionInMatrix(vertexes[i].nodeIndex), graph);
                        break;
                }

                points[i] = new Point(x, y);
            }
        }
    }

    private getConvexNeighbourIndex(currentVertexIndex: number, vertexes: PolygonVertex[]) {
        if (vertexes[currentVertexIndex - 1].isConvex) {
            return currentVertexIndex - 1;
        } else {
            return currentVertexIndex + 1;
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