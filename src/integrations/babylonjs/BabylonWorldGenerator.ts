import { Scene } from 'babylonjs/scene';
import { WorldGenerator } from '../../WorldGenerator';
import { BabylonMeshFactoryService } from './services/BabylonMeshFactoryService';
import { BabylonMeshLoaderService } from './services/BabylonMeshLoaderService';


export class BabylonWorldGenerator<T> extends WorldGenerator<T> {

    constructor(scene: Scene) {
        super(new BabylonMeshFactoryService(scene), new BabylonMeshLoaderService(scene));
    }
}