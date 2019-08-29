import { WorldItemTransformator } from "../transformators/WorldItemTransformator";
import { WorldItemInfo } from "../WorldItemInfo";
import { WorldItemUtils } from '../WorldItemUtils';
import { WorldItemInfoFactory } from '../WorldItemInfoFactory';

/**
 * For each `WorldItemInfo` of type 'room' it creates a new `WorldIemInfo` of type 'roof'.
 */
export class AddRoofModifier implements WorldItemTransformator {
    private worldItemFactory: WorldItemInfoFactory;

    constructor(worldItemFactory: WorldItemInfoFactory) {
        this.worldItemFactory = worldItemFactory;
    }

    public transform(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        const root = worldItems[0];
        const rooms = WorldItemUtils.filterRooms(worldItems);

        rooms.forEach(room => root.children.push(this.createRoof(room)));

        return worldItems;
    }

    private createRoof(room: WorldItemInfo) {
        const roof = this.worldItemFactory.clone('roof', room);

        return roof;
    }
}