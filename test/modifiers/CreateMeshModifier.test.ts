import * as sinon from 'sinon';
import { BabylonMeshLoader } from '../../src/integrations/babylonjs/api/BabylonMeshLoader';
import { CreateMeshModifier } from '../../src/modifiers/CreateMeshModifier';
import { MeshFactory } from '../../src/integrations/api/MeshFactory';
import { MeshDescriptor } from '../../src/integrations/api/Config';

describe(`CreateMeshModifier`, () => {
    describe(`prepareMeshTemplates`, () => {
        it ('loads the mesh for every `MeshDescriptor` that has a `FileDescriptor`', () => {
            const meshDescriptors = setupMeshDescriptors();

            const load = sinon.stub()
                .onFirstCall()
                .resolves({type: 'door'})
                .onSecondCall()
                .resolves({type: 'window'});

            const meshLoader: Partial<BabylonMeshLoader> = {
                load
            };

            const meshFactory = <MeshFactory> {
                setMeshTemplates: <any> sinon.spy()
            };

            const meshCreationTransformator = new CreateMeshModifier(<BabylonMeshLoader> meshLoader, meshFactory);

            return meshCreationTransformator.prepareMeshTemplates(meshDescriptors)
                .then(() => {
                    sinon.assert.calledWith(load, 'door', meshDescriptors[0]);
                    sinon.assert.calledWith(load, 'window', meshDescriptors[2]);
                });
        });
    });
});

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