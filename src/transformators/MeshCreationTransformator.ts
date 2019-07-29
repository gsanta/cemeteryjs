import { WorldItemInfo } from "../WorldItemInfo";
import { MeshFactory } from '../integrations/babylonjs/MeshFactory';
import { TreeIteratorGenerator } from "../utils/TreeIteratorGenerator";

export class MeshCreationTransformator {
    private meshFactory: MeshFactory;

    constructor(meshFactory: MeshFactory) {
        this.meshFactory = meshFactory;
    }

    public transform(worldItems: WorldItemInfo[]): WorldItemInfo[] {
        worldItems.forEach(rootItem => {
            for (const item of TreeIteratorGenerator(rootItem)) {
                item.mesh = this.createMesh(item)
            }
        });

        return worldItems;
    }

    private createMesh(worldItemInfo: WorldItemInfo): void {
        let mesh: any;
        switch (worldItemInfo.name) {
            case 'wall':
                mesh = this.meshFactory.createWall(worldItemInfo);
                break;
            case 'door':
                mesh = this.meshFactory.createDoor(worldItemInfo);
                break;
            case 'player':
                mesh = this.meshFactory.createPlayer(worldItemInfo);
            case 'table':
                mesh = this.meshFactory.createTable(worldItemInfo);
                break;
            case 'cupboard':
                mesh = this.meshFactory.createCupboard(worldItemInfo);
                break;
            case 'bathtub':
                mesh = this.meshFactory.createBathtub(worldItemInfo);
                break;
            case 'washbasin':
                mesh = this.meshFactory.createWashbasin(worldItemInfo);
                break;
            case 'chair':
                mesh = this.meshFactory.createChair(worldItemInfo);
                break;
            case 'room':
                mesh = this.meshFactory.createRoom(worldItemInfo);
                break;
            case 'empty':
                mesh = this.meshFactory.createEmptyArea(worldItemInfo);
                break;
            case 'window':
                mesh = this.meshFactory.createWindow(worldItemInfo);
                break;
            default:
                throw new Error('Unknown GameObject type: ' + worldItemInfo.name);
        }
        worldItemInfo.mesh = mesh;
    }
}