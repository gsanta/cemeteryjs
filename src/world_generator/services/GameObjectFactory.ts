import { GameObject, WorldItemShape } from './GameObject';
import { Shape } from '../../model/geometry/shapes/Shape';
import { Point } from '../../model/geometry/shapes/Point';
import { GameFacade } from '../../game/GameFacade';

export interface GameObjectConfig {
    type?: string;
    dimensions: Shape;
    name: string;
    rotation?: number;
    worldMapPositions?: Point[];
    color?: string;
    shape?: WorldItemShape;
    modelPath?: string;
    scale?: number;
}

/**
 * new `WorldItem` instances should be created via this class, so that a unique id can be set
 * for each new instance.
 */
export class GameObjectFactory {
    private countersByType: Map<string, number> = new Map();
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    create(gameObjectConfig: Partial<GameObject>): GameObject {

        const getMeshFunc = (meshName: string) => this.gameFacade.meshStore.getMesh(meshName);
        const gameObject = new GameObject(getMeshFunc, gameObjectConfig.dimensions, gameObjectConfig.name);
        gameObject.rotation = gameObjectConfig.rotation;
        gameObjectConfig.color && (gameObject.color = gameObjectConfig.color);
        gameObjectConfig.shape && (gameObject.shape = gameObjectConfig.shape);
        gameObjectConfig.modelPath && (gameObject.modelPath = gameObjectConfig.modelPath);
        gameObject.scale = gameObjectConfig.scale ? gameObjectConfig.scale : 1;

        return gameObject;
    }

    clone(newType: string, gameObject: GameObject): GameObject {
        const id = this.getNextId(newType);

        const getMeshFunc = (meshName: string) => this.gameFacade.meshStore.getMesh(meshName);
        const clone = new GameObject(getMeshFunc, gameObject.dimensions, newType);

        clone.children = [...gameObject.children];
        clone.rotation = gameObject.rotation;
        clone.parent = gameObject.parent;
        gameObject.color && (clone.color = gameObject.color);
        gameObject.shape && (clone.shape = gameObject.shape);
        gameObject.modelPath && (clone.modelPath = gameObject.modelPath);
        clone.scale = gameObject.scale;
        clone.texturePath = gameObject.texturePath;

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