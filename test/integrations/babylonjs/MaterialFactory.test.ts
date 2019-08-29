import { createMaterialBuilder as setupMaterialBuilder, createScene as setupScene } from "../../test_utils/mocks";
import { MaterialFactory } from '../../../src/integrations/babylonjs/MaterialFactory';
import { MeshDescriptor, ShapeDescriptor } from '../../../src/integrations/babylonjs/MeshFactory';
import { WorldItemInfo } from "../../../src";
import { Color3, Texture } from 'babylonjs';


describe('MaterialFactory', () => {

    it ('Create material based on the `materials` prop if no conditional material is configured', () => {
        const [materialBuilder] = setupMaterialBuilder();
        const scene = setupScene();
        const materialFactory = new MaterialFactory(scene, materialBuilder);

        const meshDescriptor: MeshDescriptor<ShapeDescriptor> = {
            name: 'mesh-descriptor',
            materials: ['#FF0000'],
            type: 'wall',
            details: {
                name: 'shape-descriptor',
                shape: 'rect'
            }
        };

        const worldItem = <WorldItemInfo> {
            name: 'wall',
        }

        const material = materialFactory.createMaterial(worldItem, meshDescriptor);

        expect(material.diffuseColor).toEqual(new Color3(1, 0, 0));
        expect(material.name).toEqual("1");
    });

    it ('Create material based on condition if `conditionalMaterial` is configured', () => {
        const [materialBuilder] = setupMaterialBuilder();
        const scene = setupScene();
        const materialFactory = new MaterialFactory(scene, materialBuilder);

        const meshDescriptor: MeshDescriptor<ShapeDescriptor> = {
            name: 'mesh-descriptor',
            materials: ['#FF0000'],
            conditionalMaterials: [
                {
                    name: 'parent-room-based-material-descriptor',
                    parentId: 'room-1',
                    color: '#00FF00'
                },
                {
                    name: 'parent-room-based-material-descriptor',
                    parentId: 'room-2',
                    path: './path-to-material'
                }
            ],
            type: 'wall',
            details: {
                name: 'shape-descriptor',
                shape: 'rect'
            }
        };

        let worldItem = <WorldItemInfo> {
            name: 'wall',
            rooms: [
                {
                    id: 'room-1'
                }
            ]
        };

        let material = materialFactory.createMaterial(worldItem, meshDescriptor);

        expect(material.diffuseColor).toEqual(new Color3(0, 1, 0));
        expect(material.name).toEqual("1");

        worldItem = <WorldItemInfo> {
            name: 'wall',
            rooms: [
                {
                    id: 'room-2'
                }
            ]
        }

        material = materialFactory.createMaterial(worldItem, meshDescriptor);

        expect((<Texture> material.diffuseTexture).url).toEqual('./path-to-material');
        expect(material.name).toEqual("2");
    });
});
