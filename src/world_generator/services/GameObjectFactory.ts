import { GameObject, WorldItemShape } from './GameObject';
import { GameObjectTemplate } from './GameObjectTemplate';
import { Shape } from '../../model/geometry/shapes/Shape';
import { Point } from '../../model/geometry/shapes/Point';
import { Polygon } from '../../model/geometry/shapes/Polygon';

export interface GameObjectConfig {
    type?: string;
    dimensions: Shape;
    name: string;
    rotation?: number;
    worldMapPositions?: Point[];
    color?: string;
    shape?: WorldItemShape;
    modelPath?: string;
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

    create(gameObjectConfig: GameObjectConfig): GameObject {
        gameObjectConfig = {...defaultWorldItemConfig, ...gameObjectConfig};

        const gameObject = new GameObject(gameObjectConfig.dimensions, gameObjectConfig.name);
        gameObject.rotation = gameObjectConfig.rotation;
        gameObjectConfig.color && (gameObject.color = gameObjectConfig.color);
        gameObjectConfig.shape && (gameObject.shape = gameObjectConfig.shape);
        gameObjectConfig.modelPath && (gameObject.modelFileName = gameObjectConfig.modelPath);
        gameObject.scale = 1;

        return gameObject;
    }

    clone(newType: string, gameObject: GameObject): GameObject {
        const id = this.getNextId(newType);

        const clone = new GameObject(
            gameObject.dimensions,
            newType
        );

        clone.children = [...gameObject.children];
        clone.rotation = gameObject.rotation;
        clone.parent = gameObject.parent;
        gameObject.color && (clone.color = gameObject.color);
        gameObject.shape && (clone.shape = gameObject.shape);
        gameObject.modelFileName && (clone.modelFileName = gameObject.modelFileName);
        clone.scale = gameObject.scale;

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