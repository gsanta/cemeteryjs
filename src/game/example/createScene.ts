import { SpriteObj } from '../../core/models/game_objects/SpriteObj';
import { Registry } from '../../core/Registry';
import { BabylonEngineFacade } from '../../core/adapters/babylonjs/BabylonEngineFacade';
import { SceneLoader } from './SceneLoader';
const scene1 = require('./scene1.json');

export function createScene(canvas: HTMLCanvasElement) {
    const registry = new Registry();
    registry.engine = new BabylonEngineFacade(registry);
    registry.engine.setup(canvas);

    const sceneLoader = new SceneLoader(registry);
    sceneLoader.load(scene1);
    // const spriteObj = new SpriteObj();
    // spriteObj.frameName = 'tree1';
    // registry.services.spriteLoader.load(spriteObj);
    // spriteObj.sprite.width = 0.43;
    // spriteObj.sprite.height = 1;
}