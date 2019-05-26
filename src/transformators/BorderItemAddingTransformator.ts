import { WorldItemInfo } from '../WorldItemInfo';
import { TreeIteratorGenerator } from '../gwm_world_item/iterator/TreeIteratorGenerator';
import { WorldItemTransformator } from './WorldItemTransformator';
import _ = require('lodash');
import { Line, Rectangle } from '@nightshifts.inc/geometry';


export class BorderItemAddingTransformator implements WorldItemTransformator {
    private roomSeparatorItemNames: string[];
    private doNotIncludeBorderItemsThatIntersectsOnlyAtCorner: boolean;

    constructor(roomSeparatorItemNames: string[], doNotIncludeBorderItemsThatIntersectsOnlyAtCorner = true) {
        this.roomSeparatorItemNames = roomSeparatorItemNames;
        this.doNotIncludeBorderItemsThatIntersectsOnlyAtCorner = doNotIncludeBorderItemsThatIntersectsOnlyAtCorner
    }

    public transform(gwmWorldItems: WorldItemInfo[]): WorldItemInfo[] {
        return this.addBoderItems(gwmWorldItems);
    }

    private addBoderItems(worldItems: WorldItemInfo[]): WorldItemInfo[] {
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

    private doesBorderItemIntersectOnlyAtCorner(roomSeparator: WorldItemInfo, intersectionLine: Line) {
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
}