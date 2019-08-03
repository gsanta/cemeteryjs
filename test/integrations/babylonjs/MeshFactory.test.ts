import { ModelTypeDescription, MeshFactory } from '../../../src/integrations/babylonjs/MeshFactory';
import { ModelFileLoader } from '../../../src/integrations/babylonjs/ModelFileLoader';
import * as sinon from 'sinon';

describe(`MeshFactory`, () => {
    describe(`loadModels`, () => {
        it.only ('loads the meshes based on the description', () => {
            const descriptions: ModelTypeDescription[] = [
                {
                    type: 'bed',
                    model: 'file',
                    fileDescription: {
                        path: 'bed_path',
                        fileName: 'bed.babylon',
                        scale: 0.5
                    }
                },
                {
                    type: 'table',
                    model: 'file',
                    fileDescription: {
                        path: 'table_path',
                        fileName: 'table.babylon',
                        scale: 0.2
                    }
                }
            ];

            const meshModel1 = [['mesh1'], ['skeleton1'], 'bed'];
            const meshModel2 = [['mesh2'], ['skeleton2'], 'table'];

            const load = sinon.stub()
                .resolves(meshModel1)
                .resolves(meshModel2);

            const modelFileLoader: Partial<ModelFileLoader> = {
                load
            };

            const meshFactory = new MeshFactory(null, <ModelFileLoader> modelFileLoader, null);

            meshFactory.loadModels(descriptions)
                .then(() => {

                    expect(load.getCall(0).args[0]).toEqual('bed');
                });

        });
    });
});
