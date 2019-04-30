import { MatrixGraph } from "../../matrix_graph/MatrixGraph";
import _ = require("lodash");
import { Line } from "../../model/Line";
import { Point } from "../../model/Point";
import { Polygon } from "../../model/Polygon";
import { PolygonRedundantPointReducer } from '../polygon_area_parser/PolygonRedundantPointReducer';
import { GwmWorldItem } from '../../model/GwmWorldItem';
import { GwmWorldItemParser } from "../GwmWorldItemParser";
import { WorldMapToRoomMapConverter } from './WorldMapToRoomMapConverter';
import { WorldMapToMatrixGraphConverter } from "../../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { PolygonAreaInfoParser } from '../polygon_area_parser/PolygonAreaInfoParser';

/**
 * @hidden
 *
 * Generates room info
 */
export class RoomInfoParser implements GwmWorldItemParser {
    private worldMapToRoomMapConverter: WorldMapToRoomMapConverter;
    private worldMapConverter: WorldMapToMatrixGraphConverter;
    private polygonAreaInfoGenerator: PolygonAreaInfoParser;

    constructor(
        roomCharacter = '-',
        worldMapConverter = new WorldMapToMatrixGraphConverter(),
        polygonAreaInfoGenerator = new PolygonAreaInfoParser('room', roomCharacter),
        worldMapToRoomMapConverter = new WorldMapToRoomMapConverter('W', '-', ['W', 'D', 'I']),
    ) {
        this.worldMapConverter = worldMapConverter;
        this.worldMapToRoomMapConverter = worldMapToRoomMapConverter;
        this.polygonAreaInfoGenerator = polygonAreaInfoGenerator;
    }

    public generate(graph: MatrixGraph): GwmWorldItem[] {
        return this.polygonAreaInfoGenerator.generate(graph);
    }

    public generateFromStringMap(strMap: string): GwmWorldItem[] {
        return this.polygonAreaInfoGenerator.generate(this.parseWorldMap(strMap));
    }

    public parseWorldMap(strMap: string): MatrixGraph {
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
            xList.sort(RoomInfoParser.sortByNumber);

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
                const newPoints = this.processNextPoint2(point, prevPoint);
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

    private processNextPoint2(actPoint: Point, prevPoint: Point): Point[] {
        const newPoints: Point[] = [];

        if (prevPoint.x !== actPoint.x) {
            newPoints.push(new Point(actPoint.x, prevPoint.y))
        }

        prevPoint = actPoint

        newPoints.push(actPoint);

        return newPoints;
    }

    private static sortByNumber(a: number, b: number) {
        return a - b;
    }
}