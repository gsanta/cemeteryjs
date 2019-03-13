import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { GwmWorldItemGenerator } from '../GwmWorldItemGenerator';
import { GwmWorldItem } from '../../model/GwmWorldItem';
import { TreeIteratorGenerator } from '../../gwm_world_item/iterator/TreeIteratorGenerator';
import _ = require('lodash');


export class BorderItemAddingWorldItemGeneratorDecorator implements GwmWorldItemGenerator {
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

    private addBoderItems(worldItems: GwmWorldItem[]): GwmWorldItem[] {
        const rooms = this.filterRooms(worldItems);
        const roomSeparatorItems = this.filterRoomSeparatorItems(worldItems);

        roomSeparatorItems.forEach(roomSeparatorItem => {
            rooms
                .filter(room => room.dimensions.intersectBorder(roomSeparatorItem.dimensions))
                .forEach(room => room.borderItems.push(roomSeparatorItem));
        });

        return worldItems;
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