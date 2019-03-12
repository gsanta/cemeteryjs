import { GwmWorldItemGenerator } from "../GwmWorldItemGenerator";
import { MatrixGraph } from "../../matrix_graph/MatrixGraph";
import { GwmWorldItem } from "../../model/GwmWorldItem";
import _ = require("lodash");
import { TreeIteratorGenerator } from "../../gwm_world_item/iterator/TreeIteratorGenerator";

export class BorderItemSegmentingWorldItemGeneratorDecorator  implements GwmWorldItemGenerator {
    private decoratedWorldItemGenerator: GwmWorldItemGenerator;
    private roomSeparatorItemNames: string[];

    constructor(decoratedWorldItemGenerator: GwmWorldItemGenerator, roomSeparatorItemNames: string[]) {
        this.decoratedWorldItemGenerator = decoratedWorldItemGenerator;
        this.roomSeparatorItemNames = roomSeparatorItemNames;
    }

    public generate(graph: MatrixGraph): GwmWorldItem[] {
        return this.addBoderItems(this.decoratedWorldItemGenerator.generate(graph));
    }

    public generateFromStringMap(strMap: string): GwmWorldItem[] {
        return this.addBoderItems(this.decoratedWorldItemGenerator.generateFromStringMap(strMap));
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        return this.decoratedWorldItemGenerator.getMatrixGraphForStringMap(strMap);
    }

    private segmentBorderItemsIfNeeded(worldItems: GwmWorldItem[]): GwmWorldItem[] {
        const rooms = this.filterRooms(worldItems);
        const roomSeparatorItems = this.filterRoomSeparatorItems(worldItems);

        const itemsToSegment = roomSeparatorItems;

        while (itemsToSegment.length > 0) {
            const firstItem = itemsToSegment.shift();
            const room = this.findRoomByWhichToSegment(firstItem, rooms);

            if (room) {

            }
        }

        roomSeparatorItems.forEach(roomSeparatorItem => {
            rooms
                .filter(room => room.dimensions.intersectBorder(roomSeparatorItem.dimensions))
                .forEach(room => room.borderItems.push(roomSeparatorItem));
        });

        return worldItems;
    }

    private findRoomByWhichToSegment(roomSeparator: GwmWorldItem, rooms: GwmWorldItem[]) {
        return _.find(rooms, (room: GwmWorldItem) => room.dimensions.intersectBorder(roomSeparator.dimensions));
    }

    private segmentByRoom(roomSeparator: GwmWorldItem, segmentingRoom: GwmWorldItem) {
        const line = segmentingRoom.dimensions.intersectBorder(roomSeparator.dimensions);

        if (line.isVertical()) {

        }
        if (intersection[0][0])
    }

    private segmentVertically(roomSeparator: GwmWorldItem, segmentPositions: [number, number]) {
        return roomSeparator
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

        return worldItems;
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