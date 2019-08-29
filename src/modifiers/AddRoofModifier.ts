import { Modifier } from "./Modifier";
import { WorldItem } from "../WorldItemInfo";
import { WorldItemUtils } from '../WorldItemUtils';
import { WorldItemFactory } from '../WorldItemInfoFactory';

/**
 * For each `WorldItemInfo` of type 'room' it creates a new `WorldIemInfo` of type 'roof'.
 */
export class AddRoofModifier implements Modifier {
    static modName: 'addRoof';

    private worldItemFactory: WorldItemFactory;

    constructor(worldItemFactory: WorldItemFactory) {
        this.worldItemFactory = worldItemFactory;
    }

    getName(): string {
        return AddRoofModifier.name;
    }

    public apply(worldItems: WorldItem[]): WorldItem[] {
        const root = worldItems[0];
        const rooms = WorldItemUtils.filterRooms(worldItems);

        rooms.forEach(room => root.children.push(this.createRoof(room)));

        return worldItems;
    }

    private createRoof(room: WorldItem) {
        const roof = this.worldItemFactory.clone('roof', room);

        return roof;
    }
}