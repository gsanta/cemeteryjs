import { GwmWorldItemGenerator } from '../GwmWorldItemGenerator';
import { MatrixGraph } from '../../matrix_graph/MatrixGraph';
import { GwmWorldItem } from '../../model/GwmWorldItem';
import { TreeIteratorGenerator } from '../../gwm_world_item/iterator/TreeIteratorGenerator';

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
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                item.dimensions = item.dimensions = item.dimensions.scaleX(this.scaling.x).scaleY(this.scaling.y);
            }
        });

        return worldItems;
    }
}