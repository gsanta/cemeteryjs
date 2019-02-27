import { MatrixGraph } from "../../matrix_graph/MatrixGraph";
import _ = require("lodash");
import { Line } from "../../model/Line";
import { Point } from "../../model/Point";
import { Polygon } from "../../model/Polygon";
import { PolygonRedundantPointReducer } from './PolygonRedundantPointReducer';
import { WorldItem } from '../../model/WorldItem';
import { WorldItemGenerator } from "../WorldItemGenerator";
import { WorldMapToRoomMapConverter } from './WorldMapToRoomMapConverter';
import { WorldMapToMatrixGraphConverter } from "../../matrix_graph/conversion/WorldMapToMatrixGraphConverter";

export class RoomInfoGenerator implements WorldItemGenerator {
    private polygonRedundantPointReducer: PolygonRedundantPointReducer;
    private roomCharacter: string;
    private worldMapToRoomMapConverter: WorldMapToRoomMapConverter;
    private worldMapConverter: WorldMapToMatrixGraphConverter;

    constructor(
        roomCharacter = '-',
        worldMapConverter = new WorldMapToMatrixGraphConverter(),
        worldMapToRoomMapConverter = new WorldMapToRoomMapConverter('W', '-', ['W', 'D', 'I']),
    ) {
        this.roomCharacter = roomCharacter;
        this.worldMapConverter = worldMapConverter;
        this.worldMapToRoomMapConverter = worldMapToRoomMapConverter;
        this.polygonRedundantPointReducer = new PolygonRedundantPointReducer();
    }

    public generate(graph: MatrixGraph): WorldItem[] {
        return graph.createConnectedComponentGraphsForCharacter(this.roomCharacter)
            .map(componentGraph => {
                const lines = this.segmentGraphToHorizontalLines(componentGraph);

                const points = this.polygonRedundantPointReducer.reduce(
                    this.createPolygonPointsFromHorizontalLines(lines)
                );

                return new WorldItem(null, new Polygon(points), 'room');
            });
    }

    public generateFromStringMap(strMap: string): WorldItem[] {
        return this.generate(this.getMatrixGraphForStringMap(strMap));
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        return this.worldMapConverter.convert(
            this.worldMapToRoomMapConverter.convert(strMap)
        );
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
            xList.sort(RoomInfoGenerator.sortByNumber);

            const xStart = xList[0];
            const xEnd = _.last(xList);

            lines.push(new Line(new Point(xStart, yPos), new Point(xEnd, yPos)));
        });

        return lines;
    }

    private createPolygonPointsFromHorizontalLines(lines: Line[]): Point[] {
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


        return [...topPoints, ...rightPoints, ...bottomPoints, ...leftPoints];
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