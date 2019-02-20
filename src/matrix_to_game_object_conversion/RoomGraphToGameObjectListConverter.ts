import { MatrixGraph } from "../matrix_graph/MatrixGraph";
import { GameObject } from "..";
import _ = require("lodash");
import { Line } from "../model/Line";
import { Point } from "../model/Point";
import { Polygon } from "../model/Polygon";


export class RoomGraphToGameObjectListConverter {
    private static Y_UNIT_LENGTH = 2;
    private static X_UNIT_LENGTH = 1;

    public convert(graph: MatrixGraph, roomCharacter: string): GameObject<any, Polygon>[] {
        return graph.createConnectedComponentGraphsForCharacter(roomCharacter)
            .map(componentGraph => {
                const lines = this.segmentGraphToHorizontalLines(componentGraph);

                const polygon = this.createPolygonFromHorizontalLines(lines);
                return new GameObject<any, Polygon>('room', polygon, 'abc');
            });
    }

    /*
     * Converts the polygon points of the component graph to horizontal lines which
     * include all of the points in the graph.
     */
    private segmentGraphToHorizontalLines(componentGraph: MatrixGraph): Line[] {
        const map = new Map<Number, number[]>();

        componentGraph.getAllVertices()
            .forEach(vertex => {
                const position = componentGraph.getVertexPositionInMatrix(vertex);

                if (map.get(position.y) === undefined) {
                    map.set(position.y, []);
                }

                map.get(position.y).push(position.x);
            });

        const lines: Line[] = [];

        map.forEach((xList: number[], yPos: number) => {
            xList.sort(RoomGraphToGameObjectListConverter.sortByNumber);

            const xStart = xList[0];
            const xEnd = _.last(xList);

            lines.push(new Line(new Point(xStart, yPos), new Point(xEnd, yPos)));
        });

        return lines;
    }

    private createPolygonFromHorizontalLines(lines: Line[]): Polygon {
        lines.sort((a: Line, b: Line) => a.start.y - b.start.y);

        const topPoints = [lines[0].start, lines[0].end.addX(1)];
        const bottomPoints = [_.last(lines).end.addY(1).addX(1), _.last(lines).start.addY(1)];

        let prevPoint = lines[0].end.addX(1);

        const rightPoints: Point[] = [];

        _.chain(lines)
            .without(_.first(lines))
            .map(line => line.end.addX(1))
            .forEach(point => {
                const newPoints = this.processNextPoint(point, prevPoint);
                rightPoints.push(...newPoints);

                prevPoint = _.last(newPoints);
            })
            .value();

        prevPoint = bottomPoints[1];
        const leftPoints: Point[] = [];

        lines = _.without(lines, _.first(lines));
        lines.reverse();

        _.chain(lines)
            .map(line => line.start)
            .forEach(point => {
                const newPoints = this.processNextPoint(point, prevPoint);
                leftPoints.push(...newPoints);

                prevPoint = _.last(newPoints);
            })
            .value();


        const points = [...topPoints, ...rightPoints, ...bottomPoints, ...leftPoints];

        return new Polygon(points);
    }

    private processNextPoint(actPoint: Point, prevPoint: Point): Point[] {
        const newPoints: Point[] = [];

        if (prevPoint.x !== actPoint.x) {
            newPoints.push(new Point(prevPoint.x, actPoint.y))
        }

        prevPoint = actPoint

        newPoints.push(actPoint);

        return newPoints;
    }

    private static sortByNumber(a: number, b: number) {
        return a - b;
    }
}