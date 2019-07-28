import { SimpleMeshCreator } from './SimpleMeshCreator';
import * as sinon from 'sinon';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { SimpleMaterialCreator } from './SimpleMaterialCreator';
import { BoundingBoxCreator } from './BoundingBoxCreator';
import { expect } from 'chai';
import { VectorModel } from '../../../model/core/VectorModel';
import { Vector3, Space } from '@babylonjs/core';
import { Polygon } from '@nightshifts.inc/geometry';
declare const describe, it, beforeEach;

describe('`BoundingBoxCreator`', () => {
    describe('`createMesh`', () => {
        const boundingRectangle = Polygon.createRectangle(0, 0, 1, 1);
        const height = 2;
        const hexColor = '#FF0000';

        let translate: sinon.SinonSpy;
        let box: Partial<Mesh>;
        let createBox: sinon.SinonStub;
        let simpleMeshCreator: Partial<SimpleMeshCreator>;

        let createMaterialFromHexString: sinon.SinonStub;
        let simpleMaterialCreator: Partial<SimpleMaterialCreator>;

        beforeEach(() => {
            translate = sinon.spy();
            box = {
                translate
            };
            createBox = sinon.stub().returns(box);
            simpleMeshCreator = {
                createBox
            };
            createMaterialFromHexString = sinon.stub().returns({});
            simpleMaterialCreator = {
                createMaterialFromHexString
            };
        });

        it ('returns with a bounding box mesh', () => {
            const boundingBoxCreator = new BoundingBoxCreator(<SimpleMeshCreator> simpleMeshCreator, <SimpleMaterialCreator> simpleMaterialCreator);

            const result = boundingBoxCreator.createMesh(boundingRectangle, height, hexColor);

            expect(result).to.deep.include({
                isVisible: true,
                material: { alpha: 0.5, wireframe: false }
            });
        });

        it ('calls `simpleMeshCreator` and `simpleMaterialCreator` with the correct parameters', () => {
            const boundingBoxCreator = new BoundingBoxCreator(<SimpleMeshCreator> simpleMeshCreator, <SimpleMaterialCreator> simpleMaterialCreator);

            boundingBoxCreator.createMesh(boundingRectangle, height, hexColor);

            sinon.assert.calledWith(createMaterialFromHexString, 'bounding-box-#FF0000', '#FF0000');

            const x = boundingRectangle.getBoundingInfo().extent[0];
            const z = boundingRectangle.getBoundingInfo().extent[1];
            sinon.assert.calledWith(createBox, 'bounding-box', new VectorModel(x, height, z));
        });

        it ('positions the bounding box to the center', () => {
            const boundingBoxCreator = new BoundingBoxCreator(<SimpleMeshCreator> simpleMeshCreator, <SimpleMaterialCreator> simpleMaterialCreator);

            boundingBoxCreator.createMesh(boundingRectangle, height, hexColor);

            const center = boundingRectangle.getBoundingCenter();
            sinon.assert.calledWith(translate, new Vector3(center.x, height / 2, center.y), 1, Space.WORLD);
        });
    });
});
