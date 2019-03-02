import { GwmWorldItemGenerator } from '../GwmWorldItemGenerator';
import { GwmWorldItem } from '../../model/GwmWorldItem';
import { MatrixGraph } from '../../matrix_graph/MatrixGraph';


export class MockWorldItemGenerator implements GwmWorldItemGenerator {
    private worldItems: GwmWorldItem[];

    constructor(worldItems: GwmWorldItem[]) {
        this.worldItems = worldItems;
    }

    public generate(graph: MatrixGraph): GwmWorldItem[] {
        return this.worldItems;
    }

    public generateFromStringMap(strMap: string): GwmWorldItem[] {
        return this.worldItems;
    }

    public getMatrixGraphForStringMap(strMap: string): MatrixGraph {
        throw new Error('`getMatrixGraphForStringMap` not implemented for `MockWorldItemGenerator`');
    }
}