import { GwmWorldItemGenerator } from '../GwmWorldItemGenerator';
import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { GwmWorldItem } from '../../model/GwmWorldItem';

type Scaling = {
    x: number,
    y: number
}

export class ScalingWorldItemGeneratorDecorator {
    private decoratedWorldItemGenerator: GwmWorldItemGenerator;
    private scaling: Scaling;

    constructor(decoratedWorldItemGenerator: GwmWorldItemGenerator, scaling: Scaling = { x: 1, y: 1}) {
        this.decoratedWorldItemGenerator = decoratedWorldItemGenerator;
        this.scaling = scaling;
    }

    public generate(graph: MatrixGraph): GwmWorldItem[] {
        return this.scaleItems(this.decoratedWorldItemGenerator.generate(graph));
    }

    public generateFromStringMap(strMap: string): GwmWorldItem[] {
        return this.scaleItems(this.decoratedWorldItemGenerator.generateFromStringMap(strMap));
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        return this.decoratedWorldItemGenerator.getMatrixGraphForStringMap(strMap);
    }

    private scaleItems(worldItems: GwmWorldItem[]): GwmWorldItem[] {
        worldItems.forEach(worldItem => worldItem.dimensions = worldItem.dimensions.scaleX(this.scaling.x).scaleY(this.scaling.y));

        return worldItems;
    }
}