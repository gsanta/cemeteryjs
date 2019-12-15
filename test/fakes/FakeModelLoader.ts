import { ModelLoader, ModelData } from '../../src/model/services/ModelLoader';
import { Point } from '@nightshifts.inc/geometry';

export class FakeModelLoader extends ModelLoader {

    private pathToDimensionMap: Map<string, Point> = new Map();

    constructor(pathToDimensionMap: Map<string, Point>) {
        super(null);
        this.pathToDimensionMap = pathToDimensionMap;
    }

    getModel(path: string): ModelData {
        if (this.pathToDimensionMap.has(path)) {
            const dim = this.pathToDimensionMap.get(path);

            return {
                mesh: null,
                skeleton: null,
                dimensions: dim
            }
        }
        return null;
    }
}