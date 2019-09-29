import { WorldItem } from "./WorldItem";
import { TreeIteratorGenerator } from "./model/utils/TreeIteratorGenerator";

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
                if (roomSeparatorItemNames.find(separatorName => item.name === separatorName)) {
                    roomSeparatorItems.push(item);
                }
            }
        });

        return roomSeparatorItems;
    }


    public static setupMap(worldMap: string) {
        return `
            map \`

            ${worldMap}

            \`

            definitions \`

            W = wall
            - = empty
            X = player
            D = disc
            C = cupboard
            I = window
            T = table
            B = bathtub
            S = washbasin
            E = bed
            H = chair
            D = door
            L = double_bed
            O = shelves
            = = subarea

            \`
        `;
    }
}