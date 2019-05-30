import { WorldItemTransformator } from './WorldItemTransformator';
import { WorldItemInfo } from '../WorldItemInfo';
import { WorldItemInfoUtils } from '../WorldItemInfoUtils';
import _ = require('lodash');

/**
 *
 */
export class BorderItemToRoomPolygonSideAssigningTransformator  implements WorldItemTransformator {
    private roomSeparatorItemNames: string[];

    constructor(roomSeparatorItemNames: string[]) {
        this.roomSeparatorItemNames = roomSeparatorItemNames;
    }

    public transform(worldItemInfos: WorldItemInfo[]): WorldItemInfo[] {
        const rooms = WorldItemInfoUtils.filterRooms(worldItemInfos);
        const roomSeparatorItems = WorldItemInfoUtils.filterBorderItems(worldItemInfos, this.roomSeparatorItemNames);

        rooms.forEach(room => {
            const lines = room.dimensions.getEdges();
            const borderItems = room.borderItems;

            borderItems.forEach(item => {
                this.findSideForBorderItem(item, room);
            })
        });

        return worldItemInfos;
    }

    private findSideForBorderItem(borderItem: WorldItemInfo, room: WorldItemInfo) {
        const borderItemSides = borderItem.dimensions.getEdges();

        borderItemSides.filter(side => {
            const coincidingSides = room.dimensions.getCoincidentLineSegment(side);

            if (coincidingSides) {
                const overlap = coincidingSides[0][0].overlapsLine(side);
                1;
            }
        });
    }
}