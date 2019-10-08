import { WorldItem } from "../../WorldItem";
import { Modifier } from './Modifier';
import { Polygon, Point, Line, StripeView, GeometryService } from '@nightshifts.inc/geometry';
import { WorldItemFactoryService } from '../services/WorldItemFactoryService';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { WorldItemUtils } from '../../WorldItemUtils';
import { ScaleModifier } from "./ScaleModifier";
import { ConfigService } from '../services/ConfigService';
import { without, flat, sortNum } from '../utils/Functions';

/**
 * If a border spans alongside multiple rooms it cuts the border into pieces so that each piece will separate exactly two neigbouring rooms
 * but not more than that.
 *
 * e.g
 *
 * ROOM1|ROOM2                  ROOM1|ROOM2
 * -----------  ------------>   ------.....
 * ROOM3|ROOM4                  ROOM3|ROOM4
 *
 */
export class SegmentBordersModifier  implements Modifier {
    static modName = 'segmentBorders';
    dependencies = []

    private configService: ConfigService;
    private geometryService: GeometryService;
    private worldItemFactoryService: WorldItemFactoryService;

    constructor(configService: ConfigService, worldItemFactoryService: WorldItemFactoryService, geometryService: GeometryService) {
        this.configService = configService;
        this.worldItemFactoryService = worldItemFactoryService;
        this.geometryService = geometryService;
    }

    getName(): string {
        return SegmentBordersModifier.modName;
    }

    apply(gwmWorldItems: WorldItem[]): WorldItem[] {
        return this.segmentBorderItemsIfNeeded(gwmWorldItems);
    }

    private segmentBorderItemsIfNeeded(worldItems: WorldItem[]): WorldItem[] {
        const rooms = WorldItemUtils.filterRooms(worldItems);
        const originalBorders = WorldItemUtils.filterBorders(worldItems, this.configService.borderTypes);
        const borders = [...originalBorders];
        const newBorders: WorldItem[] = [];

        while (borders.length > 0) {
            const currentBorder = borders.shift();

            const neighbouringRoomsAlongsideBorder = this.findRoomsAlongsideBorder(currentBorder, rooms);
            const segmentingPoints = this.getSegmentingPoints(currentBorder, neighbouringRoomsAlongsideBorder);
            const segments = this.createSegmentsFromSegmentingPoints(segmentingPoints);
            const segmentedBorders = this.segmentOriginalBorderIntoPieces(currentBorder, segments);

            newBorders.push(...segmentedBorders);
        }

        const items = without(worldItems, ...originalBorders)
        items.push(...newBorders);

        return items;
    }

    private getSegmentingPoints(border: WorldItem, roomsAlongsideBorder: WorldItem[]): Point[] {
        const startCapEdge = new StripeView(<Polygon> border.dimensions, border.rotation).getCapEdges()[0];
        const endCapEdge = new StripeView(<Polygon> border.dimensions, border.rotation).getCapEdges()[1];
        const referencePointForSorting = startCapEdge.getPoints()[0];

        const getSegmentPointsForRoom = (room: WorldItem) => room.dimensions.getCoincidentLineSegment(border.dimensions)[0].getPoints();
        const sortByDistanceToReferencePoint = (a, b) => referencePointForSorting.distanceTo(a) - referencePointForSorting.distanceTo(b);
        const getOriginalFirstPoint = (points: Point[]) => startCapEdge.getLine().intersection(new Segment(points[0], points[points.length - 1]).getLine())
        const replaceFirstPointWithOriginal = (points: Point[]) => { points.shift(); points.unshift(getOriginalFirstPoint(points));};
        const getOriginalLastPoint = (points: Point[]) => endCapEdge.getLine().intersection(new Segment(points[0], points[points.length - 1]).getLine())
        const replaceLastPointWithOriginal = (points: Point[]) => { points.pop(); points.push(getOriginalLastPoint(points))};


        let segmentPoints = flat<Point>(roomsAlongsideBorder.map(getSegmentPointsForRoom), 2);
        segmentPoints.sort(sortByDistanceToReferencePoint);

        if (segmentPoints.length > 0) {
            replaceFirstPointWithOriginal(segmentPoints);
            replaceLastPointWithOriginal(segmentPoints);
        } else {
            segmentPoints = new StripeView(<Polygon> border.dimensions, border.rotation).getEdges()[0].getPoints();
        }

        return segmentPoints;
    }

    private segmentOriginalBorderIntoPieces(originalBorderItem: WorldItem, segments: Segment[]): WorldItem[] {
        const longEdges: [Segment, Segment] = new StripeView(<Polygon> originalBorderItem.dimensions, originalBorderItem.rotation).getEdges();
        const perpendicularSlope = longEdges[0].getPerpendicularBisector().slope;

        const segmentedBorders: WorldItem[] = [];

        segments.map(segment => {
            const startPerpendicularLine = Line.fromPointSlopeForm(segment.getPoints()[0], perpendicularSlope);
            const endPerpendicularLine = Line.fromPointSlopeForm(segment.getPoints()[1], perpendicularSlope);
            const point1 = longEdges[0].getLine().intersection(endPerpendicularLine);
            const point2 = longEdges[1].getLine().intersection(endPerpendicularLine);
            const point3 = longEdges[0].getLine().intersection(startPerpendicularLine);
            const point4 = longEdges[1].getLine().intersection(startPerpendicularLine);

            const clone = this.worldItemFactoryService.clone(originalBorderItem.name, originalBorderItem);
            clone.dimensions = this.geometryService.factory.polygon([
                point1,
                point2,
                point4,
                point3
            ]);

            return segmentedBorders.push(clone);
        });

        return segmentedBorders;
    }

    private createSegmentsFromSegmentingPoints(points: Point[]): Segment[] {
        points = [...points];

        if (points.length === 2) {
            return [new Segment(points[0], points[1])];
        }

        const getMiddlePoint = (p1: Point, p2: Point) => new Segment(p1, p2).getBoundingCenter();

        const firstSegment = new Segment(points[0], getMiddlePoint(points[2], points[2]));

        const restSegments: Segment[] = [];

        for (let i = 1; i < points.length - 2; i+=2) {
            if (points.length > i + 3) {
                restSegments.push(new Segment(points[i], getMiddlePoint(points[i + 2], points[i + 3])));
            } else {
                restSegments.push(new Segment(points[i], points[i + 2]));
            }
        }

        return [firstSegment, ...restSegments];
    }

    private findRoomsAlongsideBorder(border: WorldItem, rooms: WorldItem[]): WorldItem[] {
        return rooms
            .filter(room => room.dimensions.getCoincidentLineSegment(border.dimensions))
            .filter(room => {
                const coincidingLineInfo = room.dimensions.getCoincidentLineSegment(border.dimensions);

                const intersectionExtent = this.getIntersectionExtent(coincidingLineInfo[0]);

                if (coincidingLineInfo[0].getLine().isVertical()) {

                    if (border.dimensions.getBoundingInfo().min[1] < intersectionExtent[0] || border.dimensions.getBoundingInfo().max[1] > intersectionExtent[1]) {
                        return room;
                    }
                } else {

                    if (border.dimensions.getBoundingInfo().min[0] < intersectionExtent[0] || border.dimensions.getBoundingInfo().max[0] > intersectionExtent[1]) {
                        return room;
                    }
                }
            });
    }

    // TODO: support intersections other than horizontal or vertical
    private getIntersectionExtent(segment: Segment): [number, number] {
        if (segment.getLine().isVertical()) {
            const segmentPositions = sortNum([segment.getPoints()[0].y, segment.getPoints()[1].y]);

            return [segmentPositions[0] - this.configService.globalConfig.scale.y, segmentPositions[1] + this.configService.globalConfig.scale.y];
        } else {
            const segmentPositions = sortNum([segment.getPoints()[0].x, segment.getPoints()[1].x]);

            return [segmentPositions[0] - this.configService.globalConfig.scale.x, segmentPositions[1] + this.configService.globalConfig.scale.x];
        }
    }
}