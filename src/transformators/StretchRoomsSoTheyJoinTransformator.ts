import { TreeIteratorGenerator } from "../gwm_world_item/iterator/TreeIteratorGenerator";
import { GwmWorldItem } from "../GwmWorldItem";
import { GwmWorldItemTransformator } from './GwmWorldItemTransformator';


export class StretchRoomsSoTheyJoinTransformator implements GwmWorldItemTransformator {
    private scales: {xScale: number, yScale: number};

    constructor(scales: {xScale: number, yScale: number} = {xScale: 1, yScale: 1}) {
        this.scales = scales;
    }

    public transform(gwmWorldItems: GwmWorldItem[]): GwmWorldItem[] {
        return this.stretchRooms(gwmWorldItems);
    }

    private stretchRooms(rootWorldItems: GwmWorldItem[]) {
        const rooms: GwmWorldItem[] = [];

        rootWorldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                if (item.name === 'room') {
                    rooms.push(item);
                }
            }
        });

        rooms.forEach(room => {
            room.dimensions = room.dimensions.stretch(this.scales.xScale / 2, this.scales.yScale / 2);
        });

        return rootWorldItems;
    }
}