import { Registry } from "../../Registry";
import { AssetStore } from "./AssetStore";
import { GameStore } from "./GameStore";
import { IdGenerator } from "../IdGenerator";
import { LevelStore } from "./LevelStore";

export const SceneStoreId = 'scene-store';
export const SpriteStoreId = 'sprite-store';
export const NodeStoreId = 'node-store';

export class Stores {
    private registry: Registry

    levelStore: LevelStore;
    assetStore: AssetStore;

    constructor(registry: Registry) {
        this.registry = registry;
        this.levelStore = new LevelStore();
        this.assetStore = new AssetStore(this.registry);

        this.assetStore.setIdGenerator(new IdGenerator());
    }
}