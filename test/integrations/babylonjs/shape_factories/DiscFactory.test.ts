import { Polygon, Shape } from '@nightshifts.inc/geometry';
import { Mesh, Vector3 } from 'babylonjs';
import * as sinon from 'sinon';
import { DiscFactory } from '../../../../src/integrations/babylonjs/shape_factories/DiscFactory';
import { createMaterialBuilder, createMeshBuilder, createScene } from '../../../testUtils';
import { WorldItemInfo } from '../../../../src/WorldItemInfo';

describe('DiscFactory', () => {
    describe('createItem', () => {
        it ('creates a disc mesh', () => {
            const scene = createScene();
            const [MeshBuilder, MeshBuilderStubs] = createMeshBuilder();
            const [MaterialBuilder, MaterialBuilderStubs] = createMaterialBuilder();

            const discFactory = new DiscFactory(scene, MeshBuilder, MaterialBuilder)

            const worldItem = <WorldItemInfo> {
                name: 'disc-item',
                dimensions: <Shape> Polygon.createRectangle(5, 5, 2, 2)
            }

            const mesh = discFactory.createItem(worldItem, {name: 'shape-descriptor', shape: 'disc'});

            sinon.assert.calledWith(MeshBuilderStubs.CreateDisc, "disc", {radius: 1, arc: 1, tessellation: 36, sideOrientation: Mesh.DOUBLESIDE}, scene);
            sinon.assert.calledWith(MaterialBuilderStubs.CreateMaterial, 'disc-material', scene);

            sinon.assert.calledWith((<sinon.SinonStub> mesh.translate), new Vector3(6, 0, 6), 1);

            expect(mesh).toMatchObject({
                name: 'Disc',
                checkCollisions: true,
                material: {
                    name: 'material'
                }
            });
        });

        it ('translates the mesh on the y axis if `translateY` is configured for `ShapeDescriptor`', () => {
            const scene = createScene();
            const [MeshBuilder] = createMeshBuilder();
            const [MaterialBuilder] = createMaterialBuilder();

            const discFactory = new DiscFactory(scene, MeshBuilder, MaterialBuilder)

            const worldItem = <WorldItemInfo> {
                name: 'disc-item',
                dimensions: <Shape> Polygon.createRectangle(5, 5, 2, 2)
            }

            const mesh = discFactory.createItem(worldItem, {name: 'shape-descriptor', shape: 'disc', translateY: 2});

            sinon.assert.calledWith((<sinon.SinonStub> mesh.translate), new Vector3(6, 2, 6), 1);
        });
    });
});