
export enum GameObjectType {
    MeshObject = 'MeshObject',
    PathObject = 'PathObject',
    RouteObject = 'RouteObject'
}


export interface IGameObject {
    objectType: GameObjectType;
    id: string;
}