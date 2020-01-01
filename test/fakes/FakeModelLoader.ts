import { AbstractModelLoader, ModelData } from '../../src/common/AbstractModelLoader';
import { Point } from '../../src/model/geometry/shapes/Point';
import { Mesh } from 'babylonjs';

export class FakeModelLoader extends AbstractModelLoader {

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

    createInstance(fileName: string): string {
        return null;
    }

    protected setModel(fileName: string, mesh: Mesh): void {
        
    }
}