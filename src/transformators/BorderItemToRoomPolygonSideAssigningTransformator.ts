import { WorldItemTransformator } from './WorldItemTransformator';
import { WorldItemInfo } from '../WorldItemInfo';
import { WorldItemInfoUtils } from '../WorldItemInfoUtils';

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

        
    }
}