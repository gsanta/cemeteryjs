import { MeshLoader } from '../../../src/integrations/babylonjs/MeshLoader';
import * as sinon from 'sinon';
import { WorldItemInfo } from '../../../src';
import { MeshFactory, ModelDescriptor } from '../../../src/integrations/babylonjs/MeshFactory';

function setupModelFileLoader(): [MeshLoader, sinon.SinonStub] {
    const meshModel1 = [['mesh1'], ['skeleton1'], 'bed'];
    const meshModel2 = [['mesh2'], ['skeleton2'], 'table'];

    const load = sinon.stub()
        .onFirstCall()
        .resolves(meshModel1)
        .onSecondCall()
        .resolves(meshModel2);

    const modelFileLoader: Partial<MeshLoader> = {
        load
    };

    return [<MeshLoader> modelFileLoader, load];
}

function setupModelFactory(): [MeshFactory, sinon.SinonStub] {
    const createItem = sinon.stub()
        .onFirstCall()
        .returns('bed')
        .onSecondCall()
        .returns('table');

    const modelFactory: Partial<MeshFactory> = {
        createItem
    }

    return [<MeshFactory> modelFactory, createItem];
}

function setuoModelDescriptions(): ModelDescriptor[] {
    return [
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
}

describe(`MeshFactory`, () => {
    describe(`loadModels`, () => {
        it ('loads the models based on the description of the models', () => {

            const [modelFileLoader, load] = setupModelFileLoader();
            const meshFactory = new MeshFactory(null, modelFileLoader, null);

            return meshFactory.loadModels(setuoModelDescriptions())
                .then(() => {

                    expect(load.getCall(0).args).toEqual(["bed", "bed_path", "bed.babylon", [], {"x": 0.5, "y": 0.5, "z": 0.5}]);
                    expect(load.getCall(1).args).toEqual(["table", "table_path", "table.babylon", [], {"x": 0.2, "y": 0.2, "z": 0.2}]);
                });
        });
    });

    describe(`getInstance`, () => {
        it ('creates the correct instance based on the `type` of the `WorldItemInfo`', () => {
            const [modelFileLoader] = setupModelFileLoader();
            const [modelFactory, createItem] = setupModelFactory();
            const meshFactory = new MeshFactory(null, modelFileLoader, modelFactory);

            const bed: Partial<WorldItemInfo> = {
                name: 'bed'
            };

            const table: Partial<WorldItemInfo> = {
                name: 'table'
            };

            return meshFactory.loadModels(setuoModelDescriptions())
                .then(() => {
                    expect(meshFactory.getInstance(<WorldItemInfo> bed)).toEqual('bed');
                    expect(meshFactory.getInstance(<WorldItemInfo> table)).toEqual('table');

                    expect(createItem.getCall(0).args).toEqual([{"name": "bed"}, [["mesh1"], ["skeleton1"]]]);
                    expect(createItem.getCall(1).args).toEqual([{"name": "table"}, [["mesh2"], ["skeleton2"]]]);
                });
        });
    });
});
