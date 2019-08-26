import { Polygon } from "@nightshifts.inc/geometry";
import { WorldItemInfo } from './WorldItemInfo';


/**
 * new `WorldItemInfo` instances should be created via this class, so that a unique id can be set
 * for each new instance.
 */
export class WorldItemInfoFactory {
    private idCounter = 1;

    public create(type: string, dimensions: Polygon, name: string, isBorder: boolean, rotation?: number): WorldItemInfo {
        const id = this.idCounter++ + '';
        const worldItem = new WorldItemInfo(id, type, dimensions, name, isBorder);
        if (rotation !== undefined) {
            worldItem.rotation = rotation;
        }

        return worldItem;
    }

    public clone(worldItemInfo: WorldItemInfo): WorldItemInfo {
        const id = this.idCounter++ + '';

        const clone = new WorldItemInfo(
            id,
            worldItemInfo.type,
            worldItemInfo.dimensions,
            worldItemInfo.name
        );

        clone.children = worldItemInfo.children;
        clone.borderItems = worldItemInfo.borderItems;
        clone.rotation = worldItemInfo.rotation;
        clone.isBorder = worldItemInfo.isBorder;
        clone.thickness = worldItemInfo.thickness;
        clone.parent = worldItemInfo.parent;

        return clone;
    }

}