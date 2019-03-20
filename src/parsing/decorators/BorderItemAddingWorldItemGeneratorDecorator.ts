import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { GwmWorldItemGenerator } from '../GwmWorldItemGenerator';
import { GwmWorldItem } from '../../model/GwmWorldItem';
import { TreeIteratorGenerator } from '../../gwm_world_item/iterator/TreeIteratorGenerator';
import _ = require('lodash');
import { Rectangle } from '../..';


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

        rooms.forEach(room => {
            roomSeparatorItems
                .filter(roomSeparator => room.dimensions.intersectBorder(roomSeparator.dimensions))
                .forEach(roomSeparator => room.borderItems.push(roomSeparator));
        });

        return worldItems;
    }

    private isNarrowSide(rectangle: Rectangle) {

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