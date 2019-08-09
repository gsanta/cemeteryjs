import { Scene, MeshBuilder } from 'babylonjs';
import * as sinon from 'sinon';

export function createScene(): Scene {
    return <Scene> {

    };
}

export function createMeshBuilder(): typeof MeshBuilder {
    return <typeof MeshBuilder> {
        CreateDisc: (<any> sinon.stub())
    }
}