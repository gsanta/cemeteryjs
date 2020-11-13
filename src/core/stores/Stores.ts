import { Registry } from "../Registry";
import { AssetStore } from "./AssetStore";
import { LevelStore } from "./LevelStore";
import { IdGenerator } from "./IdGenerator";
import { ViewStore } from "./ViewStore";
import { ObjStore } from "./ObjStore";
import { GameState, GameStore } from "./GameStore";

export const SceneStoreId = 'scene-store';
export const SpriteStoreId = 'sprite-store';
export const NodeStoreId = 'node-store';

export class Stores {
    private registry: Registry

    levelStore: LevelStore;
    assetStore: AssetStore;
    objStore: ObjStore;

    game: GameStore;

    constructor(registry: Registry) {
        this.registry = registry;
        this.levelStore = new LevelStore();
        this.assetStore = new AssetStore(this.registry);
        this.objStore = new ObjStore(this.registry);

        this.assetStore.setIdGenerator(new IdGenerator());
        this.objStore.setIdGenerator(new IdGenerator());
        this.game = new GameStore(this.registry);
    }
}