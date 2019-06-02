import { WorldItemInfo } from '../WorldItemInfo';
import { WorldItemTransformator } from './WorldItemTransformator';
import _ = require('lodash');
import { Line } from '@nightshifts.inc/geometry';
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
                    const intersectionLine = room.dimensions.getCoincidentLineSegment(roomSeparator.dimensions);

                    if (!intersectionLine) {
                        return false;
                    }

                    if (this.doNotIncludeBorderItemsThatIntersectsOnlyAtCorner) {
                        return !this.doesBorderItemIntersectOnlyAtCorner(roomSeparator, intersectionLine[0]);
                    }

                    return true;
                })
                .forEach(roomSeparator => room.borderItems.push(roomSeparator));
        });

        return worldItems;
    }

    private doesBorderItemIntersectOnlyAtCorner(roomSeparator: WorldItemInfo, intersectionLine: Line) {
        const edges = roomSeparator.dimensions.getEdges();

        const smallerEdge = _.minBy(edges, edge => edge.getLength());

        return intersectionLine.getLength() === smallerEdge.getLength();
    }
}