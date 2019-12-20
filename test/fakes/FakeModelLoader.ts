import { ModelLoader, ModelData } from '../../src/world_generator/services/ModelLoader';
import { Point } from '../../src/model/geometry/shapes/Point';

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
                dimensions: dim,
                instanceCounter: 0
            }
        }
        return null;
    }
}