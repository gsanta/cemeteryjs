import { GwmWorldItemGenerator } from "../GwmWorldItemGenerator";
import { GwmWorldItem } from "../../model/GwmWorldItem";
import { MatrixGraph } from "../../matrix_graph/MatrixGraph";
import { TreeIteratorGenerator } from "../../gwm_world_item/iterator/TreeIteratorGenerator";


export class StretchRoomsSoTheyJoinWorldItemGeneratorDecorator {
    private decoratedWorldItemGenerator: GwmWorldItemGenerator;
    private scales: {xScale: number, yScale: number};

    constructor(
        decoratedWorldItemGenerator: GwmWorldItemGenerator,
        scales: {xScale: number, yScale: number} = {xScale: 1, yScale: 1}
    ) {
        this.decoratedWorldItemGenerator = decoratedWorldItemGenerator;
        this.scales = scales;
    }

    public generate(graph: MatrixGraph): GwmWorldItem[] {
        return this.stretchRooms(this.decoratedWorldItemGenerator.generate(graph));
    }

    public generateFromStringMap(strMap: string): GwmWorldItem[] {
        return this.stretchRooms(this.decoratedWorldItemGenerator.generateFromStringMap(strMap));
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        return this.decoratedWorldItemGenerator.getMatrixGraphForStringMap(strMap);
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