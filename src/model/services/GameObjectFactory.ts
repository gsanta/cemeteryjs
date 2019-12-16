import { Polygon, Point, Shape } from '@nightshifts.inc/geometry';
import { GameObject, WorldItemShape } from '../types/GameObject';
import { WorldGeneratorServices } from './WorldGeneratorServices';
import { GameObjectTemplate, WorldItemRole } from '../types/GameObjectTemplate';

export interface GameObjectConfig {
    type?: string;
    dimensions: Shape;
    name: string;
    isBorder: boolean;
    rotation?: number;
    worldMapPositions?: Point[];
    color?: string;
    shape?: WorldItemShape;
    modelPath?: string;
    roles?: WorldItemRole[];
}

export const defaultWorldItemConfig: Partial<GameObjectConfig> = {
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

    public create(gameObjectConfig: GameObjectConfig, gameObjectTemplate: GameObjectTemplate): GameObject {
        gameObjectConfig = {...defaultWorldItemConfig, ...gameObjectConfig};

        const id = this.getNextId(gameObjectConfig.name);
        const gameObject = new GameObject(id, gameObjectConfig.type, gameObjectConfig.dimensions, gameObjectConfig.name, gameObjectConfig.isBorder);
        gameObject.worldMapPositions = gameObjectConfig.worldMapPositions;
        gameObject.rotation = gameObjectConfig.rotation;
        gameObject.definition = gameObjectTemplate;
        gameObjectConfig.color && (gameObject.color = gameObjectConfig.color);
        gameObjectConfig.shape && (gameObject.shape = gameObjectConfig.shape);
        gameObjectConfig.modelPath && (gameObject.modelFileName = gameObjectConfig.modelPath);

        gameObject.roles = gameObjectTemplate ? gameObjectTemplate.roles : gameObjectConfig.roles;

        return gameObject;
    }

    public clone(newType: string, gameObject: GameObject): GameObject {
        const id = this.getNextId(newType);

        const clone = new GameObject(
            id,
            gameObject.type,
            gameObject.dimensions,
            newType
        );

        clone.children = [...gameObject.children];
        clone.borderItems = [...gameObject.borderItems];
        clone.rotation = gameObject.rotation;
        clone.isBorder = gameObject.isBorder;
        clone.thickness = gameObject.thickness;
        clone.parent = gameObject.parent;
        clone.definition = gameObject.definition;
        gameObject.color && (clone.color = gameObject.color);
        gameObject.shape && (clone.shape = gameObject.shape);
        gameObject.modelFileName && (clone.modelFileName = gameObject.modelFileName);
        clone.roles = gameObject.roles;

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