import { Polygon, Point, Shape } from '@nightshifts.inc/geometry';
import { GameObject, WorldItemShape } from '../types/GameObject';
import { WorldGeneratorServices } from './WorldGeneratorServices';
import { GameObjectTemplate } from '../types/GameObjectTemplate';

export interface WorldItemConfig {
    type?: string;
    dimensions: Shape;
    name: string;
    isBorder: boolean;
    rotation?: number;
    worldMapPositions?: Point[];
    color?: string;
    shape?: WorldItemShape;
    modelPath?: string;
}

export const defaultWorldItemConfig: Partial<WorldItemConfig> = {
    rotation: 0,
    worldMapPositions: []
}

/**
 * new `WorldItem` instances should be created via this class, so that a unique id can be set
 * for each new instance.
 */
export class GameObjectFactory {
    private countersByType: Map<string, number> = new Map();
    private services: WorldGeneratorServices;

    constructor(services: WorldGeneratorServices) {
        this.services = services;
    }

    public createOld(type: string, dimensions: Polygon, name: string, isBorder: boolean, rotation?: number): GameObject {
        const id = this.getNextId(name);
        const worldItem = new GameObject(id, type, dimensions, name, isBorder);
        if (rotation !== undefined) {
            worldItem.rotation = rotation;
        }

        return worldItem;
    }

    public create(worldItemConfig: WorldItemConfig, worldItemDefinition: GameObjectTemplate): GameObject {
        worldItemConfig = {...defaultWorldItemConfig, ...worldItemConfig};

        const id = this.getNextId(worldItemConfig.name);
        const worldItem = new GameObject(id, worldItemConfig.type, worldItemConfig.dimensions, worldItemConfig.name, worldItemConfig.isBorder);
        worldItem.worldMapPositions = worldItemConfig.worldMapPositions;
        worldItem.rotation = worldItemConfig.rotation;
        worldItem.definition = worldItemDefinition;
        worldItemConfig.color && (worldItem.color = worldItemConfig.color);
        worldItemConfig.shape && (worldItem.shape = worldItemConfig.shape);
        worldItemConfig.modelPath && (worldItem.modelFileName = worldItemConfig.modelPath);

        return worldItem;
    }

    public clone(newType: string, worldItemInfo: GameObject): GameObject {
        const id = this.getNextId(newType);

        const clone = new GameObject(
            id,
            worldItemInfo.type,
            worldItemInfo.dimensions,
            newType
        );

        clone.children = [...worldItemInfo.children];
        clone.borderItems = [...worldItemInfo.borderItems];
        clone.rotation = worldItemInfo.rotation;
        clone.isBorder = worldItemInfo.isBorder;
        clone.thickness = worldItemInfo.thickness;
        clone.parent = worldItemInfo.parent;
        clone.definition = worldItemInfo.definition;
        worldItemInfo.color && (clone.color = worldItemInfo.color);
        worldItemInfo.shape && (clone.shape = worldItemInfo.shape);
        worldItemInfo.modelFileName && (clone.modelFileName = worldItemInfo.modelFileName);

        return clone;
    }

    private getNextId(name: string): string {
        if (!this.countersByType.has(name)) {
            this.countersByType.set(name, 1);
        }

        const id = `${name}-${this.countersByType.get(name)}`;

        this.countersByType.set(name, this.countersByType.get(name) + 1);

        return id;
    }
}