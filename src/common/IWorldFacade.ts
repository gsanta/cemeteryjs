import { IMeshStore } from "./IMeshStore";
import { IGameObjectStore } from "./IGameObjectStore";
import { AbstractModelLoader } from './AbstractModelLoader';

export interface IWorldFacade<T> {
    meshStore: IMeshStore<T>;
    gameObjectStore: IGameObjectStore;
    modelLoader: AbstractModelLoader;
}