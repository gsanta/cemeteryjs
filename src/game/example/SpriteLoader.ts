import { SpritePackedManager, Scene, Sprite } from 'babylonjs';
import { SpriteObj } from '../../core/models/game_objects/SpriteObj';


export class SpriteLoader {
    private manager: SpritePackedManager;

    constructor(scene: Scene) {

        this.manager = new SpritePackedManager("spm", "assets/example_game/sprites/sprite-sheet-balloons.png", 4, scene);
    }

    load(spriteObj: SpriteObj) {
        const sprite = new Sprite("sprite", this.manager);
        sprite.cellRef = spriteObj.cellRef;

        spriteObj.sprite = sprite;
    }
}