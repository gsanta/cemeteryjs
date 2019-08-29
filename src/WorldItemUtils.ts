import { WorldItem } from "./WorldItemInfo";
import { TreeIteratorGenerator } from "./utils/TreeIteratorGenerator";
import _ = require("lodash");


export class WorldItemUtils {
    public static filterRooms(worldItems: WorldItem[]): WorldItem[] {
        const rooms: WorldItem[] = [];

        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (item.name === 'room') {
                    rooms.push(item);
                }
            }
        });

        return rooms;
    }

    public static filterBorders(worldItems: WorldItem[], roomSeparatorItemNames: string[]): WorldItem[] {
        const roomSeparatorItems: WorldItem[] = [];

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