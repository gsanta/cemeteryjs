import { GameObject } from "./world_generator/services/GameObject";
import { TreeIteratorGenerator } from "./world_generator/utils/TreeIteratorGenerator";

export class WorldItemUtils {
    public static filterRooms(worldItems: GameObject[]): GameObject[] {
        const rooms: GameObject[] = [];

        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (item.name === 'room') {
                    rooms.push(item);
                }
            }
        });

        return rooms;
    }

    public static filterBorders(worldItems: GameObject[]): GameObject[] {
        const roomSeparatorItems: GameObject[] = [];

        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (item.isBorder) {
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

            W = wall BORDER
            - = room ROLES [CONTAINER]
            X = player
            D = disc
            C = cupboard
            I = window ROLES [BORDER]
            T = table
            B = bathtub
            S = washbasin
            E = bed
            H = chair
            D = door ROLES [BORDER]
            L = double_bed
            O = shelves
            = = subarea ROLES [CONTAINER]

            \`
        `;
    }
}