import { WorldItemInfo } from "../WorldItemInfo";
import _ = require("lodash");
import { TreeIteratorGenerator } from "../gwm_world_item/iterator/TreeIteratorGenerator";
import { WorldItemTransformator } from './WorldItemTransformator';
import { Rectangle, Line } from "@nightshifts.inc/geometry";
import { WorldItemInfoFactory } from '../WorldItemInfoFactory';

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
            const room = this.findRoomByWhichToSegment(currentItem, rooms);

            if (room) {
                const segmentedItems = this.segmentByRoom(currentItem, room);
                itemsToSegment.push(...segmentedItems);
                newRoomSeparatorItems.delete(currentItem);
                segmentedItems.forEach(item => newRoomSeparatorItems.add(item));
            } else {
                newRoomSeparatorItems.add(currentItem);
            }
        }

        return _.chain(worldItems).without(...roomSeparatorItems).push(...newRoomSeparatorItems).value();
    }

    private findRoomByWhichToSegment(roomSeparator: WorldItemInfo, rooms: WorldItemInfo[]): WorldItemInfo {
        const intersectingRoom = <WorldItemInfo> _.find(rooms, (room: WorldItemInfo) => room.dimensions.intersectBorder(roomSeparator.dimensions));

        if (intersectingRoom) {
            const intersectionLine = intersectingRoom.dimensions.intersectBorder(roomSeparator.dimensions);

            const intersectionExtent = this.getIntersectionExtent(intersectionLine);

            if (intersectionLine.isVertical()) {
                // const sorted = _.sortBy([intersectionLine.start.y, intersectionLine.end.y]);

                if (roomSeparator.dimensions.minY() < intersectionExtent[0] || roomSeparator.dimensions.maxY() > intersectionExtent[1]) {
                    return intersectingRoom;
                }
            } else {
                // const sorted = _.sortBy([intersectionLine.start.x, intersectionLine.end.x]);

                if (roomSeparator.dimensions.minX() < intersectionExtent[0] || roomSeparator.dimensions.maxX() > intersectionExtent[1]) {
                    return intersectingRoom;
                }
            }
        }
    }

    private segmentByRoom(roomSeparator: WorldItemInfo, segmentingRoom: WorldItemInfo): WorldItemInfo[] {
        const line = segmentingRoom.dimensions.intersectBorder(roomSeparator.dimensions);

        if (line.isVertical()) {
            return this.segmentVertically(roomSeparator, this.getIntersectionExtent(line));
        } else {
            return this.segmentHorizontally(roomSeparator, this.getIntersectionExtent(line));
        }
    }

    private segmentVertically(roomSeparator: WorldItemInfo, segmentPositions: [number, number]): WorldItemInfo[] {
        const segmentedRoomSeparators: WorldItemInfo[] = [];

        if (roomSeparator.dimensions.minY() < segmentPositions[0]) {
            const clone = this.worldItemInfoFactory.clone(roomSeparator);

            const height = segmentPositions[0] - roomSeparator.dimensions.minY();

            clone.dimensions = new Rectangle(roomSeparator.dimensions.left, roomSeparator.dimensions.top, roomSeparator.dimensions.width, height);
            segmentedRoomSeparators.push(clone);
        }

        if (roomSeparator.dimensions.maxY() > segmentPositions[1]) {
            const clone = this.worldItemInfoFactory.clone(roomSeparator);

            const height = roomSeparator.dimensions.maxY() - segmentPositions[1];

            clone.dimensions = new Rectangle(roomSeparator.dimensions.left, segmentPositions[1], roomSeparator.dimensions.width, height);
            segmentedRoomSeparators.push(clone);
        }

        const middleSegment = this.worldItemInfoFactory.clone(roomSeparator);
        const middleSegmentHeight = segmentPositions[1] - segmentPositions[0];
        middleSegment.dimensions = new Rectangle(roomSeparator.dimensions.left, segmentPositions[0], roomSeparator.dimensions.width, middleSegmentHeight);
        segmentedRoomSeparators.push(middleSegment);

        return segmentedRoomSeparators;
    }

    private segmentHorizontally(roomSeparator: WorldItemInfo, segmentPositions: [number, number]): WorldItemInfo[] {
        const segmentedRoomSeparators: WorldItemInfo[] = [];

        let bottomSegment: WorldItemInfo = null;
        let topSegment: WorldItemInfo = null;
        let middleSegment: WorldItemInfo = null;

        if (roomSeparator.dimensions.minX() < segmentPositions[0]) {
            const clone = this.worldItemInfoFactory.clone(roomSeparator);

            const width = segmentPositions[0] - roomSeparator.dimensions.minX();

            clone.dimensions = new Rectangle(roomSeparator.dimensions.left, roomSeparator.dimensions.top, width, roomSeparator.dimensions.height);

            bottomSegment = clone;
            segmentedRoomSeparators.push(clone);
        }

        if (roomSeparator.dimensions.maxX() > segmentPositions[1]) {
            const clone = this.worldItemInfoFactory.clone(roomSeparator);

            const width = roomSeparator.dimensions.maxX() - segmentPositions[1];

            clone.dimensions = new Rectangle(segmentPositions[1], roomSeparator.dimensions.top, width, roomSeparator.dimensions.height);

            topSegment = clone;
            segmentedRoomSeparators.push(clone);
        }

        middleSegment = this.worldItemInfoFactory.clone(roomSeparator);
        const middleSegmentWidth = segmentPositions[1] - segmentPositions[0];
        middleSegment.dimensions = new Rectangle(segmentPositions[0], roomSeparator.dimensions.top, middleSegmentWidth, roomSeparator.dimensions.height);
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

    private getIntersectionExtent(line: Line): [number, number] {
        if (line.isVertical()) {
            const segmentPositions = _.sortBy([line.start.y, line.end.y]);

            return [segmentPositions[0] - this.scales.yScale, segmentPositions[1] + this.scales.yScale];
        } else {
            const segmentPositions = _.sortBy([line.start.x, line.end.x]);

            return [segmentPositions[0] - this.scales.xScale, segmentPositions[1] + this.scales.xScale];
        }
    }
}