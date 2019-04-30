import { MatrixGraph } from '../matrix_graph/MatrixGraph';
import { GwmWorldItemParser } from '../parsers/GwmWorldItemParser';
import { GwmWorldItem } from '../model/GwmWorldItem';
import { TreeIteratorGenerator } from '../gwm_world_item/iterator/TreeIteratorGenerator';
import _ = require('lodash');
import { Rectangle } from '..';
import { Line } from '../model/Line';
import { GwmWorldItemTransformator } from './GwmWorldItemTransformator';


export class BorderItemAddingTransformator implements GwmWorldItemTransformator {
    private roomSeparatorItemNames: string[];
    private doNotIncludeBorderItemsThatIntersectsOnlyAtCorner: boolean;

    constructor(roomSeparatorItemNames: string[], doNotIncludeBorderItemsThatIntersectsOnlyAtCorner = true) {
        this.roomSeparatorItemNames = roomSeparatorItemNames;
        this.doNotIncludeBorderItemsThatIntersectsOnlyAtCorner = doNotIncludeBorderItemsThatIntersectsOnlyAtCorner
    }

    public transform(gwmWorldItems: GwmWorldItem[]): GwmWorldItem[] {
        return this.addBoderItems(gwmWorldItems);
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
                        return !this.doesBorderItemIntersectOnlyAtCorner(roomSeparator, intersectionLine);
                    }

                    return true;
                })
                .forEach(roomSeparator => room.borderItems.push(roomSeparator));
        });

        return worldItems;
    }

    private doesBorderItemIntersectOnlyAtCorner(roomSeparator: GwmWorldItem, intersectionLine: Line) {
        if (roomSeparator.dimensions instanceof Rectangle) {
            const narrowSides = (<Rectangle> roomSeparator.dimensions).getNarrowSides();

            if (narrowSides) {
                const narrowSides1 = narrowSides[0];//.scaleX(this.scales.xScale).scaleY(this.scales.yScale);
                const narrowSides2 = narrowSides[1];//.scaleX(this.scales.xScale).scaleY(this.scales.yScale);
                return narrowSides1.equalTo(intersectionLine) || narrowSides2.equalTo(intersectionLine);
            }
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