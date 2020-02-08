
export enum GameObjectType {
    MeshObject = 'MeshObject',
    PathObject = 'PathObject',
    RouteObject = 'RouteObject'
}


export interface IGameObject {
    objectType: GameObjectType;
    name: string;
}