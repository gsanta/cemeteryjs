import * as sinon from 'sinon';
import { MeshCreationTransformator } from '../../src/transformators/MeshCreationTransformator';
import { WorldItemInfo } from '../../src/WorldItemInfo';
import { Mesh } from "babylonjs";
import { MeshFactory, MeshDescriptor } from '../../src/integrations/babylonjs/MeshFactory';
import { MeshLoader } from '../../src/integrations/babylonjs/MeshLoader';

describe(`MeshCreationTransformator`, () => {
    describe(`prepareMeshTemplates`, () => {
        it ('loads the mesh for every `MeshDescriptor` that has a `FileDescriptor`', () => {
            const meshDescriptors = setupMeshDescriptors();

            const load = sinon.stub()
                .onFirstCall()
                .resolves({type: 'door'})
                .onSecondCall()
                .resolves({type: 'window'});

            const meshLoader: Partial<MeshLoader> = {
                load
            };

            const meshCreationTransformator = new MeshCreationTransformator(<MeshLoader> meshLoader, null);

            return meshCreationTransformator.prepareMeshTemplates(meshDescriptors)
                .then(() => {
                    sinon.assert.calledWith(load, 'door', meshDescriptors[0].details);
                    sinon.assert.calledWith(load, 'window', meshDescriptors[2].details);
                });
        });
    });

    describe('transform', () => {
        it ('sets up the mesh information for the provided `WorldItemInfo`', () => {
            const worldItems: WorldItemInfo[] = [
                <WorldItemInfo> {
                    name: 'window'
                },
                <WorldItemInfo> {
                    name: 'table'
                }
            ]
        });
    });

    // describe('transform', () => {
    //     it ('creates a mesh instance for every `WorldItemInfo`', () => {
    //         const getInstance = sinon.stub().callsFake(arg => createFakeMesh(arg.name));
    //         const meshFactory: Partial<MeshFactory> = {
    //             getInstance
    //         };

    //         const meshCreationTransformator = new MeshCreationTransformator(<MeshFactory> meshFactory);

    //         const worldItemInfo = setupWorldItemInfo();

    //         const result = meshCreationTransformator.transform(worldItemInfo);

    //         expect(result).toEqual(worldItemInfo);

    //         expect(worldItemInfo[0].mesh.name).toEqual('mesh1');
    //         expect(worldItemInfo[1].mesh.name).toEqual('mesh2');
    //         expect(worldItemInfo[0].children[0].mesh.name).toEqual('mesh1-1');
    //         expect(worldItemInfo[0].children[1].mesh.name).toEqual('mesh1-2');
    //     });
    // });
});

function setupWorldItemInfo(): WorldItemInfo[] {
    return <WorldItemInfo[]> [
        {
            name: 'mesh1',
            children: [
                <WorldItemInfo> {
                    name: 'mesh1-1'
                },
                <WorldItemInfo> {
                    name: 'mesh1-2'
                }
            ]
        },
        {
            name: 'mesh2'
        }
    ]
}

function createFakeMesh(name: string): Mesh {
    return <Mesh> {
        name
    };
}

function setupMeshDescriptors(): MeshDescriptor[] {
    return [
        {
            name: 'mesh-descriptor',
            type: 'door',
            details: {
                name: 'file-descriptor',
                path: 'path',
                fileName: 'door.babylon',
                scale: 1
            }
        },
        {
            name: 'mesh-descriptor',
            type: 'table',
            details: {
                name: 'shape-descriptor',
                shape: 'plane',
            }
        },
        {
            name: 'mesh-descriptor',
            type: 'window',
            details: {
                name: 'file-descriptor',
                path: 'path',
                fileName: 'file.babylon',
                scale: 1
            }
        }
    ];
}