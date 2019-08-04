import { MeshFactory } from "../../src/integrations/babylonjs/MeshFactory";
import * as sinon from 'sinon';
import { MeshCreationTransformator } from '../../src/transformators/MeshCreationTransformator';
import { WorldItemInfo } from '../../src/WorldItemInfo';
import { Mesh } from "babylonjs";

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

describe('MeshCreationTransformator', () => {
    describe('transform', () => {
        it ('creates a mesh instance for every `WorldItemInfo`', () => {
            const getInstance = sinon.stub().callsFake(arg => createFakeMesh(arg.name));
            const meshFactory: Partial<MeshFactory> = {
                getInstance
            };

            const meshCreationTransformator = new MeshCreationTransformator(<MeshFactory> meshFactory);

            const worldItemInfo = setupWorldItemInfo();

            const result = meshCreationTransformator.transform(worldItemInfo);

            expect(result).toEqual(worldItemInfo);

            expect(worldItemInfo[0].mesh.name).toEqual('mesh1');
            expect(worldItemInfo[1].mesh.name).toEqual('mesh2');
            expect(worldItemInfo[0].children[0].mesh.name).toEqual('mesh1-1');
            expect(worldItemInfo[0].children[1].mesh.name).toEqual('mesh1-2');
        });
    });
});
