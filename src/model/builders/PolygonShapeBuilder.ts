import { GeometryService, Point } from "@nightshifts.inc/geometry";
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { WorldItem } from '../../WorldItem';
import { WorldMapGraph } from '../../WorldMapGraph';
import { WorldMapReader } from '../readers/WorldMapReader';
import { ServiceFacade } from '../services/ServiceFacade';
import { last, without } from '../utils/Functions';
import { PolygonRedundantPointReducer } from "./PolygonRedundantPointReducer";
import { WorldItemBuilder } from "./WorldItemBuilder";
import { WorldItemTemplate } from "../../WorldItemTemplate";

/**
 * @hidden
 *
 * Generates `WorldItem`s based on connected area of the given character. It can detect `Polygon` shaped
 * areas.
 */
export class PolygonShapeBuilder implements WorldItemBuilder {
    private polygonRedundantPointReducer: PolygonRedundantPointReducer;
    private worldMapReader: WorldMapReader;
    private itemName: string;
    private services: ServiceFacade<any, any, any>;
    private geometryService: GeometryService;
    // TODO: the graph after running WorldMapConverter should only contain one character, so this info is redundant

    constructor(itemName: string, services: ServiceFacade<any, any, any>, worldMapReader: WorldMapReader) {
        this.itemName = itemName;
        this.services = services;
        this.geometryService = services.geometryService;
        this.worldMapReader = worldMapReader;
        this.polygonRedundantPointReducer = new PolygonRedundantPointReducer();
    }

    parse(worldMap: string): WorldItem[] {
        const graph = this.worldMapReader.read(worldMap);

        return graph
            .getReducedGraphForTypes([this.itemName])
            .getAllConnectedComponents()
            .map(componentGraph => {
                const lines = this.segmentGraphToHorizontalLines(componentGraph);

                const worldMapPositions = componentGraph.getAllNodes()
                    .map(vertex => componentGraph.getNodePositionInMatrix(vertex))
                    .map(vertexPos => this.services.geometryService.factory.point(vertexPos.x, vertexPos.y));

                const points = this.polygonRedundantPointReducer.reduce(
                    this.createPolygonPointsFromHorizontalLines(lines)
                );

                const template = WorldItemTemplate.getByTypeName(this.itemName, this.services.worldItemStore.worldItemTemplates);
                return this.services.worldItemFactoryService.create({
                    dimensions: this.services.geometryService.factory.polygon(points),
                    name: this.itemName,
                    isBorder: false,
                    worldMapPositions: worldMapPositions
                }, template);
            });
    }

    public parse2(graph: WorldMapGraph): WorldItem {
        const lines = this.segmentGraphToHorizontalLines(graph);

        const points = this.polygonRedundantPointReducer.reduce(
            this.createPolygonPointsFromHorizontalLines(lines)
        );

        const template = WorldItemTemplate.getByTypeName(this.itemName, this.services.worldItemStore.worldItemTemplates);
        return this.services.worldItemFactoryService.create({
            dimensions: this.geometryService.factory.polygon(points),
            name: this.itemName,
            isBorder: false
        }, template);
    }

    /*
     * Converts the polygon points of the component graph to horizontal lines which
     * include all of the points in the graph.
     */
    private segmentGraphToHorizontalLines(componentGraph: WorldMapGraph): Segment[] {
        const map = new Map<Number, number[]>();

        componentGraph.getAllNodes()
            .forEach(vertex => {
                const position = componentGraph.getNodePositionInMatrix(vertex);

                if (map.get(position.y) === undefined) {
                    map.set(position.y, []);
                }

                map.get(position.y).push(position.x);
            });

        const segments: Segment[] = [];

        map.forEach((xList: number[], yPos: number) => {
            xList.sort(PolygonShapeBuilder.sortByNumber);

            const xStart = xList[0];
            const xEnd = last(xList);

            segments.push(new Segment(new Point(xStart, yPos), new Point(xEnd, yPos)));
        });

        return segments;
    }

    private createPolygonPointsFromHorizontalLines(segments: Segment[]): Point[] {
        segments.sort((a: Segment, b: Segment) => a.getPoints()[0].y - b.getPoints()[0].y);

        const topPoints = [segments[0].getPoints()[0], segments[0].getPoints()[1].addX(1)];
        const bottomPoints = [last(segments).getPoints()[1].addY(1).addX(1), last(segments).getPoints()[0].addY(1)];

        let prevPoint = segments[0].getPoints()[1].addX(1);

        const rightPoints: Point[] = [];

        without(segments, segments[0])
            .map(line => line.getPoints()[1].addX(1))
            .forEach(point => {
                const newPoints = this.processNextPoint(point, prevPoint);
                rightPoints.push(...newPoints);

                prevPoint = last(newPoints);
            });

        prevPoint = bottomPoints[1];
        const leftPoints: Point[] = [];

        segments = without(segments, segments[0]);
        segments.reverse();

        segments
            .map(line => line.getPoints()[0])
            .forEach(point => {
                const newPoints = this.processNextPoint2(point, prevPoint);
                leftPoints.push(...newPoints);

                prevPoint = last(newPoints);
            });


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