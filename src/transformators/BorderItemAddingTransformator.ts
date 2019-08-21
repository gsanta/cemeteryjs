import { WorldItemInfo } from '../WorldItemInfo';
import { WorldItemTransformator } from './WorldItemTransformator';
import _ = require('lodash');
import { WorldItemInfoUtils } from '../WorldItemInfoUtils';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';


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
        const roomSeparatorItems = WorldItemInfoUtils.filterBorders(worldItems, this.roomSeparatorItemNames);

        rooms.forEach(room => {
            roomSeparatorItems
                .filter(roomSeparator => {
                    const intersectionLineInfo = room.dimensions.getCoincidentLineSegment(roomSeparator.dimensions);

                    if (!intersectionLineInfo) {
                        return false;
                    }

                    return !this.doesBorderItemIntersectOnlyAtCorner(roomSeparator, intersectionLineInfo);
                })
                .forEach(roomSeparator => room.borderItems.push(roomSeparator));
        });

        return worldItems;
    }

    //TODO: we might not need this when using `StripeView` for border item `Polygon`
    private doesBorderItemIntersectOnlyAtCorner(border: WorldItemInfo, intersectionLineInfo: [Segment, number, number]) {
        const edges = border.dimensions.getEdges();

        const intersectingEdge = edges[intersectionLineInfo[2]];

        return intersectingEdge.getLine().getAngleToXAxis().getAngle() !== border.rotation;
    }
}