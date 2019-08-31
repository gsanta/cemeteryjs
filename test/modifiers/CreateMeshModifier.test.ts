import * as sinon from 'sinon';
import { CreateMeshModifier } from '../../src/modifiers/CreateMeshModifier';
import { MeshFactoryService } from '../../src/services/MeshFactoryService';
import { MeshDescriptor } from '../../src/integrations/api/Config';
import { ModifierConfig } from '../../src/modifiers/ModifierConfig';
import { BabylonMeshLoaderService } from '../../src/integrations/babylonjs/services/BabylonMeshLoaderService';

describe(`CreateMeshModifier`, () => {
    describe(`prepareMeshTemplates`, () => {
        it ('loads the mesh for every `MeshDescriptor` that has a `FileDescriptor`', () => {
            const meshDescriptors = setupMeshDescriptors();

            const load = sinon.stub()
                .onFirstCall()
                .resolves({type: 'door'})
                .onSecondCall()
                .resolves({type: 'window'});

            const meshLoader: Partial<BabylonMeshLoaderService> = {
                load
            };

            const meshFactory = <MeshFactoryService<any, any>> {
            };

            const modifierConfig = <ModifierConfig<any, any>> {
                meshFactory
            }

            const meshCreationTransformator = new CreateMeshModifier<any, any>(modifierConfig);

            // return meshCreationTransformator.prepareMeshTemplates(meshDescriptors)
            //     .then(() => {
            //         sinon.assert.calledWith(load, 'door', meshDescriptors[0]);
            //         sinon.assert.calledWith(load, 'window', meshDescriptors[2]);
            //     });
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