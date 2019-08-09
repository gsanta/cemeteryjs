import { DiscFactory } from '../../../../src/integrations/babylonjs/shape_factories/DiscFactory';
import { createScene, createMeshBuilder } from '../../../testUtils';


describe('DiscFactory', () => {
    describe('createItem', () => {
        const scene = createScene();
        const meshBuilder = createMeshBuilder();

        const discFactory = new DiscFactory(scene, meshBuilder)
    });
});