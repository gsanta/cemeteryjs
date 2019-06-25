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

        let newRoomSeparatorItems: Set<WorldItemInfo> = new Set();

        while (itemsToSegment.length > 0) {
            const currentItem = itemsToSegment.shift();
            const segmentingRooms = this.findRoomsByWhichToSegment(currentItem, rooms);

            const longestEdge = currentItem.dimensions.getEdges().sort((a, b) => b.getLength() - a.getLength())[0];

            let segmentingPoints: Point[] = [];


            segmentingRooms.forEach(room => {
                const coincidentSegmentInfo = room.dimensions.getCoincidentLineSegment(currentItem.dimensions);
                segmentingPoints.push(...coincidentSegmentInfo[0].getPoints());
            });

            if (segmentingPoints.length > 0) {
                segmentingPoints.sort((a, b) => longestEdge.getPoints()[0].distanceTo(a) - longestEdge.getPoints()[0].distanceTo(b));

                segmentingPoints = this.mergeNeigbouringPointsWithDistanceSmallerThanOneUnit(segmentingPoints);
                segmentingPoints.pop();
                segmentingPoints.unshift();
                segmentingPoints.unshift(longestEdge.getPoints[0]);
                segmentingPoints.push(longestEdge.getPoints[1]);
            }



            debugger;

            // if (room) {
            //     const segmentedItems = this.segmentByRoom(currentItem, room[0]);
            //     itemsToSegment.push(...segmentedItems);
            //     newRoomSeparatorItems.delete(currentItem);
            //     segmentedItems.forEach(item => newRoomSeparatorItems.add(item));
            // } else {
            //     newRoomSeparatorItems.add(currentItem);
            // }
        }

        return _.chain(worldItems).without(...roomSeparatorItems).push(...newRoomSeparatorItems).value();
    }

    private segment(borderItem: WorldItemInfo, segmentingPoints: Point[]) {
        const sortedEdges = borderItem.dimensions.getEdges().sort((a, b) => b.getLength() - a.getLength())[0];
        const longerEdges: [Segment, Segment] = [sortedEdges[0], sortedEdges[1]];
        const perpendicularSlope = longerEdges[0].getPerpendicularBisector().m;

        for (let i = 0; i < segmentingPoints.length - 1; i++) {
            const line = Line.createFromPointSlopeForm(segmentingPoints[0], perpendicularSlope);
            const pointPair1 = longerEdges[0].in
        }
    }

    private mergeNeigbouringPointsWithDistanceSmallerThanOneUnit(points: Point[]) {
        points = [...points];
        const mergedPoints: Point[] = [];

        while (points.length > 0) {
            if (points.length > 1 && MeasurementUtils.isDistanceSmallerThanOneUnit(points[0], points[1])) {
                mergedPoints.push(new Segment(points[0], points[1]).getBoundingCenter());
                points.shift();
                points.shift();
            } else {
                mergedPoints.push(points.shift());
            }
        }

        return mergedPoints;
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

    private segmentByRoom(roomSeparator: WorldItemInfo, segmentingRoom: WorldItemInfo): WorldItemInfo[] {
        const [line] = segmentingRoom.dimensions.getCoincidentLineSegment(roomSeparator.dimensions);

        if (line.isVertical()) {
            return this.segmentVertically(roomSeparator, this.getIntersectionExtent(line));
        } else {
            return this.segmentHorizontally(roomSeparator, this.getIntersectionExtent(line));
        }
    }

    private segmentVertically(roomSeparator: WorldItemInfo, segmentPositions: [number, number]): WorldItemInfo[] {
        const segmentedRoomSeparators: WorldItemInfo[] = [];
        const dimensions = roomSeparator.dimensions;

        if (dimensions.minY() < segmentPositions[0]) {
            const clone = this.worldItemInfoFactory.clone(roomSeparator);

            const height = segmentPositions[0] - dimensions.minY();

            clone.dimensions = Polygon.createRectangle(
                dimensions.minX(),
                dimensions.minY(),
                dimensions.maxX() - dimensions.minX(),
                height
            );
            segmentedRoomSeparators.push(clone);
        }

        if (dimensions.maxY() > segmentPositions[1]) {
            const clone = this.worldItemInfoFactory.clone(roomSeparator);

            const height = dimensions.maxY() - segmentPositions[1];

            clone.dimensions = Polygon.createRectangle(
                dimensions.minX(),
                segmentPositions[1],
                dimensions.maxX() - dimensions.minX(),
                height
            );
            segmentedRoomSeparators.push(clone);
        }

        const middleSegment = this.worldItemInfoFactory.clone(roomSeparator);
        const middleSegmentHeight = segmentPositions[1] - segmentPositions[0];
        middleSegment.dimensions = Polygon.createRectangle(
            dimensions.minX(),
            segmentPositions[0],
            dimensions.maxX() - dimensions.minX(),
            middleSegmentHeight
        );
        segmentedRoomSeparators.push(middleSegment);

        return segmentedRoomSeparators;
    }

    private segmentHorizontally(roomSeparator: WorldItemInfo, segmentPositions: [number, number]): WorldItemInfo[] {
        const segmentedRoomSeparators: WorldItemInfo[] = [];
        const dimensions = roomSeparator.dimensions;

        let bottomSegment: WorldItemInfo = null;
        let topSegment: WorldItemInfo = null;
        let middleSegment: WorldItemInfo = null;

        if (dimensions.minX() < segmentPositions[0]) {
            const clone = this.worldItemInfoFactory.clone(roomSeparator);

            const width = segmentPositions[0] - dimensions.minX();

            clone.dimensions = Polygon.createRectangle(
                dimensions.minX(),
                dimensions.maxY(),
                width,
                dimensions.maxY() - dimensions.minY()
            );

            bottomSegment = clone;
            segmentedRoomSeparators.push(clone);
        }

        if (dimensions.maxX() > segmentPositions[1]) {
            const clone = this.worldItemInfoFactory.clone(roomSeparator);

            const width = dimensions.maxX() - segmentPositions[1];

            clone.dimensions = Polygon.createRectangle(
                segmentPositions[1],
                dimensions.maxY(),
                width,
                dimensions.maxY() - dimensions.minY()
            );

            topSegment = clone;
            segmentedRoomSeparators.push(clone);
        }

        middleSegment = this.worldItemInfoFactory.clone(roomSeparator);
        const middleSegmentWidth = segmentPositions[1] - segmentPositions[0];
        middleSegment.dimensions = Polygon.createRectangle(
            segmentPositions[0],
            dimensions.maxY(),
            middleSegmentWidth,
            dimensions.maxY() - dimensions.minY()
        );
        segmentedRoomSeparators.push(middleSegment);

        return segmentedRoomSeparators;
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