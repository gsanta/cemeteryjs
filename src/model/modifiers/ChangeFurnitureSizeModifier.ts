import { WorldItemUtils } from "../../WorldItemUtils";
import { WorldItem } from "../../WorldItem";
import { Polygon, Segment, Distance, Line, Angle, Transform, Measurements, Shape } from '@nightshifts.inc/geometry';
import { Modifier } from './Modifier';
import { NormalizeBorderRotationModifier } from "./NormalizeBorderRotationModifier";
import { MeshTemplateService } from "../services/MeshTemplateService";
import { RoomFurnitureResizer } from './real_furniture_size/RoomFurnitureResizer';
import { ServiceFacade } from '../services/ServiceFacade';
import { flat } from "../utils/Functions";
import { SubareaFurnitureResizer } from './real_furniture_size/SubareaFurnitureResizer';


export class ChangeFurnitureSizeModifier implements Modifier {
    static modeName = 'changeFurnitureSize';
    dependencies = [NormalizeBorderRotationModifier.modName];

    private defaultFurnitureResizer: RoomFurnitureResizer;
    private subareaFurnituerResizer: SubareaFurnitureResizer;

    constructor(services: ServiceFacade) {
        this.defaultFurnitureResizer = new RoomFurnitureResizer(services);
        this.subareaFurnituerResizer = new SubareaFurnitureResizer(services);
    }

    getName(): string {
        return ChangeFurnitureSizeModifier.modeName;
    }

    apply(worldItems: WorldItem[]): WorldItem[] {
        const rooms: WorldItem[] = WorldItemUtils.filterRooms(worldItems);

        // rooms.forEach(room => this.snapFurnituresInRoom(room));
        rooms.forEach(room => this.defaultFurnitureResizer.resize(room));
        const subareas = flat<WorldItem>(rooms.map(room => room.children.filter(child => child.name === '_subarea')), 2);

        subareas.forEach(subarea => this.subareaFurnituerResizer.resize(subarea));


        return worldItems;
    }
}

