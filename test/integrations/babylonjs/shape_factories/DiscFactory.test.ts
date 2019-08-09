import { DiscFactory } from '../../../../src/integrations/babylonjs/shape_factories/DiscFactory';
import { createScene, createMeshBuilder } from '../../../testUtils';
import { WorldItemInfo } from '../../../../src';
import * as sinon from 'sinon';
import { Mesh } from 'babylonjs';

describe('DiscFactory', () => {
    describe('createItem', () => {
        it ('creates a disc mesh', () => {
            const scene = createScene();
            const [MeshBuilder, MeshBuilderStubs] = createMeshBuilder();

            const discFactory = new DiscFactory(scene, MeshBuilder)

            const worldItem = <WorldItemInfo> {
                name: 'disc-item'
            }

            const mesh = discFactory.createItem(worldItem, null);

            sinon.assert.calledWith(MeshBuilderStubs.CreateDisc, "disc", {radius: 1, arc: 1, tessellation: 36, sideOrientation: Mesh.DOUBLESIDE}, scene);

            expect(mesh).toEqual({
                name: 'Disc',
                checkCollisions: true
            });
        });
    });
});