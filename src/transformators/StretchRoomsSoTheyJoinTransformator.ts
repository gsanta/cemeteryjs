import { TreeIteratorGenerator } from "../gwm_world_item/iterator/TreeIteratorGenerator";
import { WorldItemInfo } from "../WorldItemInfo";
import { WorldItemTransformator } from './WorldItemTransformator';
import { Polygon } from "@nightshifts.inc/geometry";


export class StretchRoomsSoTheyJoinTransformator implements WorldItemTransformator {
    private scales: {xScale: number, yScale: number};

    constructor(scales: {xScale: number, yScale: number} = {xScale: 1, yScale: 1}) {
        this.scales = scales;
    }

    public transform(gwmWorldItems: WorldItemInfo[]): WorldItemInfo[] {
        return this.stretchRooms(gwmWorldItems);
    }

    private stretchRooms(rootWorldItems: WorldItemInfo[]) {
        const rooms: WorldItemInfo[] = [];

        rootWorldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (item.name === 'room') {
                    rooms.push(item);
                }
            }
        });

        rooms.forEach(room => {
            room.dimensions = (<Polygon>room.dimensions).stretch(this.scales.xScale / 2, this.scales.yScale / 2);
        });

        return rootWorldItems;
    }
}