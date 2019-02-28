import { WorldItemGenerator } from '../WorldItemGenerator';
import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { WorldItem } from '../..';

type Scaling = {
    x: number,
    y: number
}

export class ScalingWorldItemGeneratorDecorator {
    private decoratedWorldItemGenerator: WorldItemGenerator;
    private scaling: Scaling;

    constructor(decoratedWorldItemGenerator: WorldItemGenerator, scaling: Scaling = { x: 1, y: 1}) {
        this.decoratedWorldItemGenerator = decoratedWorldItemGenerator;
        this.scaling = scaling;
    }

    public generate(graph: MatrixGraph): WorldItem[] {
        return this.scaleItems(this.decoratedWorldItemGenerator.generate(graph));
    }

    public generateFromStringMap(strMap: string): WorldItem[] {
        return this.scaleItems(this.decoratedWorldItemGenerator.generateFromStringMap(strMap));
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        return this.decoratedWorldItemGenerator.getMatrixGraphForStringMap(strMap);
    }

    private scaleItems(worldItems: WorldItem[]): WorldItem[] {
        worldItems.forEach(worldItem => worldItem.dimensions = worldItem.dimensions.scaleX(this.scaling.x).scaleY(this.scaling.y));

        return worldItems;
    }
}