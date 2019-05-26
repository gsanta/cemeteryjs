import { Polygon } from "@nightshifts.inc/geometry";
import { WorldItemInfo } from './WorldItemInfo';


/**
 * new `WorldItemInfo` instances should be created via this class, so that a unique id can be set
 * for each new instance.
 */
export class WorldItemInfoFactory {
    private idCounter = 1;

    public create(type: string, dimensions: Polygon, name: string, additionalData: any = null): WorldItemInfo {
        return new WorldItemInfo(this.idCounter++, type, dimensions, name, additionalData);
    }

    public clone(worldItemInfo: WorldItemInfo): WorldItemInfo {
        const clone = new WorldItemInfo(
            this.idCounter++,
            worldItemInfo.type,
            worldItemInfo.dimensions,
            worldItemInfo.name,
            worldItemInfo.additionalData
        );

        clone.children = worldItemInfo.children;
        clone.borderItems = worldItemInfo.borderItems;

        return clone;

    }
}