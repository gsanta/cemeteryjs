import { WorldItemUtils } from "../../WorldItemUtils";
import { GameObject } from "../types/GameObject";
import { Modifier } from './Modifier';
import { NormalizeBorderRotationModifier } from "./NormalizeBorderRotationModifier";
import { RoomFurnitureResizer } from './real_furniture_size/RoomFurnitureResizer';
import { WorldGeneratorServices } from '../services/WorldGeneratorServices';
import { flat } from "../utils/Functions";
import { SubareaFurnitureResizer } from './real_furniture_size/SubareaFurnitureResizer';


export class ChangeFurnitureSizeModifier implements Modifier {
    static modeName = 'changeFurnitureSize';
    dependencies = [NormalizeBorderRotationModifier.modName];

    private defaultFurnitureResizer: RoomFurnitureResizer;
    private subareaFurnituerResizer: SubareaFurnitureResizer;

    constructor(services: WorldGeneratorServices) {
        this.defaultFurnitureResizer = new RoomFurnitureResizer(services);
        this.subareaFurnituerResizer = new SubareaFurnitureResizer(services);
    }

    getName(): string {
        return ChangeFurnitureSizeModifier.modeName;
    }

    apply(worldItems: GameObject[]): GameObject[] {
        const rooms: GameObject[] = WorldItemUtils.filterRooms(worldItems);

        // rooms.forEach(room => this.snapFurnituresInRoom(room));
        rooms.forEach(room => this.defaultFurnitureResizer.resize(room));
        const subareas = flat<GameObject>(rooms.map(room => room.children.filter(child => child.name === '_subarea')), 2);

        subareas.forEach(subarea => this.subareaFurnituerResizer.resize(subarea));


        return worldItems;
    }
}

