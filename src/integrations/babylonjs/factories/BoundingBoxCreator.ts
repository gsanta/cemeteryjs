import { Mesh, Space, Vector3 } from '@babylonjs/core';
import { VectorModel } from '../../../model/core/VectorModel';
import { SimpleMaterialCreator } from './SimpleMaterialCreator';
import { SimpleMeshCreator } from './SimpleMeshCreator';
import { Polygon } from '@nightshifts.inc/geometry';


export class BoundingBoxCreator {
    private simpleMeshCreator: SimpleMeshCreator;
    private simpleMaterialCreator: SimpleMaterialCreator;

    constructor(simpleMeshCreator: SimpleMeshCreator, simpleMaterialCreator: SimpleMaterialCreator) {
        this.simpleMeshCreator = simpleMeshCreator;
        this.simpleMaterialCreator = simpleMaterialCreator;
    }

    public createMesh(boundingRectangle: Polygon, height: number, hexColor: string): Mesh {

        const dimensions = new VectorModel(boundingRectangle.getBoundingInfo().extent[0], height, boundingRectangle.getBoundingInfo().extent[1]);
        const box = this.simpleMeshCreator.createBox('bounding-box', dimensions);

        const center = boundingRectangle.getBoundingCenter();
        box.translate(new Vector3(center.x, height / 2, center.y), 1, Space.WORLD);

        const material = this.simpleMaterialCreator.createMaterialFromHexString(`bounding-box-${hexColor}`, hexColor);
        material.alpha = 0.5;
        material.wireframe = false;
        box.material = material;
        box.isVisible = true;

        return box;
    }
}
