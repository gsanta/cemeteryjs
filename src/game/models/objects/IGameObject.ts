
export enum GameObjectType {
    MeshObject = 'MeshObject'
}


export interface IGameObject {
    objectType: GameObjectType;
    name: string;
}