import { Modifier } from "./Modifier";
import { WorldItem } from "../WorldItemInfo";
import { WorldItemUtils } from '../WorldItemUtils';
import { WorldItemFactoryService } from '../services/WorldItemFactoryService';

/**
 * For each `WorldItemInfo` of type 'room' it creates a new `WorldIemInfo` of type 'roof'.
 */
export class AddRoofModifier implements Modifier {
    static modName: 'addRoof';
    dependencies = [];

    private worldItemFactory: WorldItemFactoryService;

    constructor(worldItemFactory: WorldItemFactoryService) {
        this.worldItemFactory = worldItemFactory;
    }

    getName(): string {
        return AddRoofModifier.modName;
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