import { Modifier } from "./Modifier";
import { GameObject } from "../types/GameObject";
import { WorldItemUtils } from '../../WorldItemUtils';
import { GameObjectFactory } from '../services/GameObjectFactory';

/**
 * For each `WorldItem` of type 'room' it creates a new `WorldIemInfo` of type 'roof'.
 */
export class AddRoofModifier implements Modifier {
    static modName: 'addRoof';
    dependencies = [];

    private worldItemFactory: GameObjectFactory;

    constructor(worldItemFactory: GameObjectFactory) {
        this.worldItemFactory = worldItemFactory;
    }

    getName(): string {
        return AddRoofModifier.modName;
    }

    public apply(worldItems: GameObject[]): GameObject[] {
        const root = worldItems[0];
        const rooms = WorldItemUtils.filterRooms(worldItems);

        rooms.forEach(room => root.children.push(this.createRoof(room)));

        return worldItems;
    }

    private createRoof(room: GameObject) {
        const roof = this.worldItemFactory.clone('roof', room);

        return roof;
    }
}