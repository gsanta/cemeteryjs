import { WorldItemInfo } from "../WorldItemInfo";
import _ = require("lodash");
import { TreeIteratorGenerator } from "../gwm_world_item/iterator/TreeIteratorGenerator";
import { WorldItemTransformator } from './WorldItemTransformator';
import { Polygon, Point, MeasurementUtils, Line } from '@nightshifts.inc/geometry';
import { WorldItemInfoFactory } from '../WorldItemInfoFactory';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';

export class BorderItemSegmentingTransformator  implements WorldItemTransformator {
    private worldItemInfoFactory: WorldItemInfoFactory;
    private roomSeparatorItemNames: string[];
    private scales: {xScale: number, yScale: number};

    constructor(
        worldItemInfoFactory: WorldItemInfoFactory,
        roomSeparatorItemNames: string[],
        scales: {xScale: number, yScale: number} = {xScale: 1, yScale: 1}
    ) {
        this.worldItemInfoFactory = worldItemInfoFactory;
        this.roomSeparatorItemNames = roomSeparatorItemNames;
        this.scales = scales;
    }

    public transform(gwmWorldItems: WorldItemInfo[]): WorldItemInfo[] {
        return this.segmentBorderItemsIfNeeded(gwmWorldItems);
    }

    private segmentBorderItemsIfNeeded(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        const rooms = this.filterRooms(worldItems);
        const roomSeparatorItems = this.filterRoomSeparatorItems(worldItems);

        const itemsToSegment = [...roomSeparatorItems];

        let newRoomSeparatorItems: WorldItemInfo[] = [];

        while (itemsToSegment.length > 0) {
            const currentItem = itemsToSegment.shift();
            const segmentingRooms = this.findRoomsByWhichToSegment(currentItem, rooms);

            const edges = currentItem.dimensions.getEdges();
            edges.sort((a, b) => b.getLength() - a.getLength());

            let segmentingPoints: Point[] = [];


            segmentingRooms.forEach(room => {
                const coincidentSegmentInfo = room.dimensions.getCoincidentLineSegment(currentItem.dimensions);
                segmentingPoints.push(...coincidentSegmentInfo[0].getPoints());
            });

            if (segmentingPoints.length > 0) {
                segmentingPoints.sort((a, b) => edges[0].getPoints()[0].distanceTo(a) - edges[0].getPoints()[0].distanceTo(b));

                segmentingPoints.pop();
                segmentingPoints.shift();
                segmentingPoints.unshift(edges[0].getPoints()[0]);
                segmentingPoints.push(edges[0].getPoints()[1]);
                const segments = this.createSegments(segmentingPoints);
                const segmentedWorldItemInfos = this.segment(currentItem, segments);
                newRoomSeparatorItems.push(...segmentedWorldItemInfos);
            } else {
                newRoomSeparatorItems.push(currentItem);
            }
        }
        debugger;
        return _.chain(worldItems).without(...roomSeparatorItems).push(...newRoomSeparatorItems).value();
    }

    private segment(borderItem: WorldItemInfo, segments: Segment[]): WorldItemInfo[] {
        const edges = borderItem.dimensions.getEdges();
        edges.sort((a, b) => b.getLength() - a.getLength())[0];
        const longerEdges: [Segment, Segment] = [edges[0], edges[1]];
        const perpendicularSlope = longerEdges[0].getPerpendicularBisector().m;

        const segmentedWorldItemInfos: WorldItemInfo[] = [];

        segments.map(segment => {
            const startPerpendicularLine = Line.createFromPointSlopeForm(segment.getPoints()[0], perpendicularSlope);
            const endPerpendicularLine = Line.createFromPointSlopeForm(segment.getPoints()[1], perpendicularSlope);
            const point1 = longerEdges[0].getLine().intersection(endPerpendicularLine);
            const point2 = longerEdges[1].getLine().intersection(endPerpendicularLine);
            const point3 = longerEdges[0].getLine().intersection(startPerpendicularLine);
            const point4 = longerEdges[1].getLine().intersection(startPerpendicularLine);

            const clone = this.worldItemInfoFactory.clone(borderItem);
            clone.dimensions = new Polygon([
                point1,
                point2,
                point4,
                point3
            ]);

            return segmentedWorldItemInfos.push(clone);
        });

        return segmentedWorldItemInfos;
    }

    private createSegments(points: Point[]): Segment[] {
        points = [...points];
        const mergedPoints: Point[] = [];

        const firstSegment = new Segment(points[0], points[2]);

        const restSegments: Segment[] = [];

        for (let i = 1; i < points.length - 2; i+=2) {
            restSegments.push(new Segment(points[i], points[i + 2]));
        }

        while (points.length > 0) {
            if (points.length > 1 && MeasurementUtils.isDistanceSmallerThanOneUnit(points[0], points[1])) {
                mergedPoints.push(new Segment(points[0], points[1]).getBoundingCenter());
                points.shift();
                points.shift();
            } else {
                mergedPoints.push(points.shift());
            }
        }

        return [firstSegment, ...restSegments];
    }

    private findRoomsByWhichToSegment(roomSeparator: WorldItemInfo, rooms: WorldItemInfo[]): WorldItemInfo[] {
        return rooms
            .filter(room => room.dimensions.getCoincidentLineSegment(roomSeparator.dimensions))
            .filter(room => {
                const coincidingLineInfo = room.dimensions.getCoincidentLineSegment(roomSeparator.dimensions);

                const intersectionExtent = this.getIntersectionExtent(coincidingLineInfo[0]);

                if (coincidingLineInfo[0].isVertical()) {

                    if (roomSeparator.dimensions.minY() < intersectionExtent[0] || roomSeparator.dimensions.maxY() > intersectionExtent[1]) {
                        return room;
                    }
                } else {

                    if (roomSeparator.dimensions.minX() < intersectionExtent[0] || roomSeparator.dimensions.maxX() > intersectionExtent[1]) {
                        return room;
                    }
                }
            });
    }

    private filterRooms(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        const rooms: WorldItemInfo[] = [];

        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (item.name === 'room') {
                    rooms.push(item);
                }
            }
        });

        return rooms;
    }

    private filterRoomSeparatorItems(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        const roomSeparatorItems: WorldItemInfo[] = [];

        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (_.find(this.roomSeparatorItemNames, separatorName => item.name === separatorName)) {
                    roomSeparatorItems.push(item);
                }
            }
        });

        return roomSeparatorItems;
    }

    private getIntersectionExtent(segment: Segment): [number, number] {
        if (segment.isVertical()) {
            const segmentPositions = _.sortBy([segment.getPoints()[0].y, segment.getPoints()[1].y]);

            return [segmentPositions[0] - this.scales.yScale, segmentPositions[1] + this.scales.yScale];
        } else {
            const segmentPositions = _.sortBy([segment.getPoints()[0].x, segment.getPoints()[1].x]);

            return [segmentPositions[0] - this.scales.xScale, segmentPositions[1] + this.scales.xScale];
        }
    }
}