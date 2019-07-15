import { WorldItemInfoUtils } from "../WorldItemInfoUtils";
import { WorldItemInfo } from "../WorldItemInfo";
import { Polygon } from '@nightshifts.inc/geometry';


export class FurnitureRealSizeTransformator {
    private realSizes: {[name: string]: Polygon};

    constructor(realFurnitureSizes: {[name: string]: Polygon}) {
        this.realSizes = realFurnitureSizes;
    }

    public transform(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        const rooms: WorldItemInfo[] = WorldItemInfoUtils.filterRooms(worldItems);

        rooms.forEach(room => this.transformFurnituresInRoom(room));

        return worldItems;
    }

    private transformFurnituresInRoom(room: WorldItemInfo) {
        room.children.forEach(furniture => {

            if (this.realSizes[furniture.name]) {
                const realSize = this.realSizes[furniture.name];
                const centerPoint = furniture.dimensions.getBoundingCenter();

                furniture.dimensions = realSize.clone().setPosition(centerPoint);
            }
        });
    }

}