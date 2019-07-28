import { MeshCreator } from './MeshCreator';
import { WorldItemInfo } from '../..';
import { Mesh } from '@babylonjs/core';

export class MeshFactory {
    private worldItemFactoryMap: Map<string, MeshCreator>;

    private factories: {[key: string]: MeshCreator};

    constructor(worldItemFactoryMap: Map<string, MeshCreator>) {
        this.worldItemFactoryMap = worldItemFactoryMap;
    }

    public createWall(itemInfo: WorldItemInfo): Mesh {
        return this.factories.wall.createItem(itemInfo);
    }

    public createPlayer(itemInfo: WorldItemInfo): Mesh {
        const worldItemFactory = this.worldItemFactoryMap.get('player');
        return worldItemFactory.createItem(itemInfo);
    }


    public createDoor(itemInfo: WorldItemInfo): Mesh {
        const worldItemFactory = this.worldItemFactoryMap.get('door');
        return worldItemFactory.createItem(itemInfo);
    }

    public createWindow(itemInfo: WorldItemInfo): Mesh {
        const worldItemFactory = this.worldItemFactoryMap.get('window');
        return worldItemFactory.createItem(itemInfo);
    }

    public createTable(itemInfo: WorldItemInfo): Mesh {
        const worldItemFactory = this.worldItemFactoryMap.get('table');
        return worldItemFactory.createItem(itemInfo);
    }

    public createBathtub(itemInfo: WorldItemInfo): Mesh {
        const worldItemFactory = this.worldItemFactoryMap.get('bathtub');
        return worldItemFactory.createItem(itemInfo);
    }

    public createWashbasin(itemInfo: WorldItemInfo): Mesh {
        const worldItemFactory = this.worldItemFactoryMap.get('washbasin');
        return worldItemFactory.createItem(itemInfo);
    }

    public createChair(itemInfo: WorldItemInfo): Mesh {
        const worldItemFactory = this.worldItemFactoryMap.get('chair');
        return worldItemFactory.createItem(itemInfo);
    }

    public createCupboard(itemInfo: WorldItemInfo): Mesh {
        const worldItemFactory = this.worldItemFactoryMap.get('cupboard');
        return worldItemFactory.createItem(itemInfo);
    }

    public createRoom(itemInfo: WorldItemInfo): Mesh {
        const worldItemFactory = this.worldItemFactoryMap.get('room');
        return worldItemFactory.createItem(itemInfo);
    }

    public createEmptyArea(itemInfo: WorldItemInfo): Mesh {
        return this.worldItemFactoryMap.get('empty').createItem(itemInfo);
    }
}
