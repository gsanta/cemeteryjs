import { WorldItemInfo } from "./WorldItemInfo";
import { TreeIteratorGenerator } from "./gwm_world_item/iterator/TreeIteratorGenerator";
import _ = require("lodash");


export class WorldItemInfoUtils {
    public static filterRooms(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        const rooms: WorldItemInfo[] = [];

        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (item.name === 'room') {
                    rooms.push(item);
                }
            }
        });

        return rooms;
    }

    public static filterBorders(worldItems: WorldItemInfo[], roomSeparatorItemNames: string[]): WorldItemInfo[] {
        const roomSeparatorItems: WorldItemInfo[] = [];

        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (_.find(roomSeparatorItemNames, separatorName => item.name === separatorName)) {
                    roomSeparatorItems.push(item);
                }
            }
        });

        return roomSeparatorItems;
    }
}