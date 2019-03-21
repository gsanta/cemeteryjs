import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { GwmWorldItemGenerator } from '../GwmWorldItemGenerator';
import { GwmWorldItem } from '../../model/GwmWorldItem';
import { TreeIteratorGenerator } from '../../gwm_world_item/iterator/TreeIteratorGenerator';
import _ = require('lodash');
import { Rectangle } from '../..';
import { Line } from '../../model/Line';


export class BorderItemAddingWorldItemGeneratorDecorator implements GwmWorldItemGenerator {
    private decoratedWorldItemGenerator: GwmWorldItemGenerator;
    private roomSeparatorItemNames: string[];
    private doNotIncludeBorderItemsThatIntersectsOnlyAtCorner: boolean;

    constructor(
        decoratedWorldItemGenerator: GwmWorldItemGenerator,
        roomSeparatorItemNames: string[],
        doNotIncludeBorderItemsThatIntersectsOnlyAtCorner = true
    ) {
        this.decoratedWorldItemGenerator = decoratedWorldItemGenerator;
        this.roomSeparatorItemNames = roomSeparatorItemNames;
        this.doNotIncludeBorderItemsThatIntersectsOnlyAtCorner = doNotIncludeBorderItemsThatIntersectsOnlyAtCorner
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
                .filter(roomSeparator => {
                    const intersectionLine = room.dimensions.intersectBorder(roomSeparator.dimensions);

                    if (!intersectionLine) {
                        return false;
                    }

                    if (this.doNotIncludeBorderItemsThatIntersectsOnlyAtCorner) {
                        return this.doesBorderItemIntersectOnlyAtCorner(roomSeparator, intersectionLine)
                    }

                    return true;
                })
                .forEach(roomSeparator => room.borderItems.push(roomSeparator));
        });

        return worldItems;
    }

    private doesBorderItemIntersectOnlyAtCorner(roomSeparator: GwmWorldItem, intersectionLine: Line) {
        const narrowSides = (<Rectangle> roomSeparator.dimensions).getNarrowSides();

        if (narrowSides) {
            return !narrowSides[0].equalTo(intersectionLine) && !narrowSides[1].equalTo(intersectionLine);
        }

        return false;
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