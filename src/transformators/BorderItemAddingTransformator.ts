import { WorldItemInfo } from '../WorldItemInfo';
import { TreeIteratorGenerator } from '../gwm_world_item/iterator/TreeIteratorGenerator';
import { WorldItemTransformator } from './WorldItemTransformator';
import _ = require('lodash');
import { Line, Rectangle } from '@nightshifts.inc/geometry';
import { WorldItemInfoUtils } from '../WorldItemInfoUtils';


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
        const rooms = WorldItemInfoUtils.filterRooms(worldItems);
        const roomSeparatorItems = WorldItemInfoUtils.filterBorderItems(worldItems, this.roomSeparatorItemNames);

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
                const narrowSides1 = narrowSides[0];
                const narrowSides2 = narrowSides[1];
                return narrowSides1.equalTo(intersectionLine) || narrowSides2.equalTo(intersectionLine);
            }
        }

        return false;
    }
}