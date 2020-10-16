import { Registry } from "../Registry";


export interface GameStoreHook {
    (registry: Registry, prop: string, newVal: any): void;
}

export type GameState = 'running' | 'paused';

export class GameStore {
    private hooks: GameStoreHook[] = [];

    private _gameState: GameState = 'paused';

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    get gameState() {
        return this._gameState;
    }

    set gameState(gameState: GameState) {
        this.hooks.forEach(hook => hook(this.registry, 'gameState', gameState));
        this._gameState = gameState;
    }

    addHook(hook: GameStoreHook) {
        this.hooks.push(hook);
    }                
}