import { GwmWorldItemGenerator } from "../GwmWorldItemGenerator";
import { MatrixGraph } from "../../matrix_graph/MatrixGraph";
import { GwmWorldItem } from "../../model/GwmWorldItem";
import _ = require("lodash");
import { TreeIteratorGenerator } from "../../gwm_world_item/iterator/TreeIteratorGenerator";
import { Polygon } from "../../model/Polygon";
import { Rectangle } from "../../model/Rectangle";

export class BorderItemSegmentingWorldItemGeneratorDecorator  implements GwmWorldItemGenerator {
    private decoratedWorldItemGenerator: GwmWorldItemGenerator;
    private roomSeparatorItemNames: string[];

    constructor(decoratedWorldItemGenerator: GwmWorldItemGenerator, roomSeparatorItemNames: string[]) {
        this.decoratedWorldItemGenerator = decoratedWorldItemGenerator;
        this.roomSeparatorItemNames = roomSeparatorItemNames;
    }

    public generate(graph: MatrixGraph): GwmWorldItem[] {
        return this.segmentBorderItemsIfNeeded(this.decoratedWorldItemGenerator.generate(graph));
    }

    public generateFromStringMap(strMap: string): GwmWorldItem[] {
        return this.segmentBorderItemsIfNeeded(this.decoratedWorldItemGenerator.generateFromStringMap(strMap));
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        return this.decoratedWorldItemGenerator.getMatrixGraphForStringMap(strMap);
    }

    private segmentBorderItemsIfNeeded(worldItems: GwmWorldItem[]): GwmWorldItem[] {
        const rooms = this.filterRooms(worldItems);
        const roomSeparatorItems = this.filterRoomSeparatorItems(worldItems);

        const itemsToSegment = [...roomSeparatorItems];

        const newRoomSeparatorItems: GwmWorldItem[] = [];

        while (itemsToSegment.length > 0) {
            const currentItem = itemsToSegment.shift();
            const room = this.findRoomByWhichToSegment(currentItem, rooms);

            if (room) {
                const segmentedItems = this.segmentByRoom(currentItem, room);
                itemsToSegment.push(...segmentedItems);
                newRoomSeparatorItems.push(...segmentedItems);
            } else {
                newRoomSeparatorItems.push(currentItem);
            }
        }

        roomSeparatorItems.forEach(roomSeparatorItem => {
            rooms
                .filter(room => room.dimensions.intersectBorder(roomSeparatorItem.dimensions))
                .forEach(room => room.borderItems.push(roomSeparatorItem));
        });

        return _.chain(worldItems).without(...roomSeparatorItems).push(...newRoomSeparatorItems).value();
    }

    private findRoomByWhichToSegment(roomSeparator: GwmWorldItem, rooms: GwmWorldItem[]): GwmWorldItem {
        const intersectingRoom = <GwmWorldItem> _.find(rooms, (room: GwmWorldItem) => room.dimensions.intersectBorder(roomSeparator.dimensions));

        if (intersectingRoom) {
            const intersection = intersectingRoom.dimensions.intersectBorder(roomSeparator.dimensions);

            if (intersection.isVertical()) {
                const sorted = _.sortBy([intersection.start.y, intersection.end.y]);

                if (roomSeparator.dimensions.minY() < sorted[0] || roomSeparator.dimensions.maxY() > sorted[1]) {
                    return intersectingRoom;
                }
            } else {
                const sorted = _.sortBy([intersection.start.x, intersection.end.x]);

                if (roomSeparator.dimensions.minX() < sorted[0] || roomSeparator.dimensions.maxX() > sorted[1]) {
                    return intersectingRoom;
                }
            }
        }
    }

    private segmentByRoom(roomSeparator: GwmWorldItem, segmentingRoom: GwmWorldItem): GwmWorldItem[] {
        const line = segmentingRoom.dimensions.intersectBorder(roomSeparator.dimensions);

        if (line.isVertical()) {
            return this.segmentVertically(roomSeparator, <[number, number]> _.sortBy([line.start.y, line.end.y]));
        } else {
            return this.segmentHorizontally(roomSeparator, <[number, number]> _.sortBy([line.start.x, line.end.x]));
        }
    }

    private segmentVertically(roomSeparator: GwmWorldItem, segmentPositions: [number, number]): GwmWorldItem[] {
        const segmentedRoomSeparators: GwmWorldItem[] = [];

        if (roomSeparator.dimensions.minY() < segmentPositions[0]) {
            const clone = roomSeparator.clone();

            const height = segmentPositions[0] - roomSeparator.dimensions.minY();

            clone.dimensions = new Rectangle(roomSeparator.dimensions.left, roomSeparator.dimensions.top, roomSeparator.dimensions.width, height);
            segmentedRoomSeparators.push(clone);
        }

        if (roomSeparator.dimensions.maxY() > segmentPositions[1]) {
            const clone = roomSeparator.clone();

            const height = roomSeparator.dimensions.maxY() - segmentPositions[1];

            clone.dimensions = new Rectangle(roomSeparator.dimensions.left, segmentPositions[1], roomSeparator.dimensions.width, height);
            segmentedRoomSeparators.push(clone);
        }

        const middleSegment = roomSeparator.clone();
        const middleSegmentHeight = segmentPositions[1] - segmentPositions[0];
        middleSegment.dimensions = new Rectangle(roomSeparator.dimensions.left, segmentPositions[0], roomSeparator.dimensions.width, middleSegmentHeight);
        segmentedRoomSeparators.push(middleSegment);

        return segmentedRoomSeparators;
    }

    private segmentHorizontally(roomSeparator: GwmWorldItem, segmentPositions: [number, number]): GwmWorldItem[] {
        const segmentedRoomSeparators: GwmWorldItem[] = [];

        if (roomSeparator.dimensions.minX() < segmentPositions[0]) {
            const clone = roomSeparator.clone();

            const width = segmentPositions[0] - roomSeparator.dimensions.minX();

            clone.dimensions = new Rectangle(roomSeparator.dimensions.left, roomSeparator.dimensions.top, width, roomSeparator.dimensions.height);
            segmentedRoomSeparators.push(clone);
        }

        if (roomSeparator.dimensions.maxX() > segmentPositions[1]) {
            const clone = roomSeparator.clone();

            const width = roomSeparator.dimensions.maxX() - segmentPositions[1];

            clone.dimensions = new Rectangle(segmentPositions[1], roomSeparator.dimensions.top, width, roomSeparator.dimensions.height);
            segmentedRoomSeparators.push(clone);
        }

        const middleSegment = roomSeparator.clone();
        const middleSegmentWidth = segmentPositions[1] - segmentPositions[0];
        middleSegment.dimensions = new Rectangle(segmentPositions[0], roomSeparator.dimensions.top, middleSegmentWidth, roomSeparator.dimensions.height);
        segmentedRoomSeparators.push(middleSegment);

        return segmentedRoomSeparators;
    }

    private filterRooms(worldItems: GwmWorldItem[]): GwmWorldItem[] {
        const rooms: GwmWorldItem[] = [];

        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (item.name === 'room') {
                    rooms.push(item);
                }
            }
        });

        return rooms;
    }

    private filterRoomSeparatorItems(worldItems: GwmWorldItem[]): GwmWorldItem[] {
        const roomSeparatorItems: GwmWorldItem[] = [];

        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (_.find(this.roomSeparatorItemNames, separatorName => item.name === separatorName)) {
                    roomSeparatorItems.push(item);
                }
            }
        });

        return roomSeparatorItems;
    }
}