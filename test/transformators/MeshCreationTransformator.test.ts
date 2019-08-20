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

            const meshFactory = <MeshFactory> {
                setMeshTemplates: <any> sinon.spy()
            };

            const meshCreationTransformator = new MeshCreationTransformator(<MeshLoader> meshLoader, meshFactory);

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