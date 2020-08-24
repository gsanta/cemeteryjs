import { Sprite } from "babylonjs";


 export class SpriteObj {

    readonly id: string;

    sprite: Sprite;

    spriteAssetId: string;
    cellRef: string;

    constructor(id: string) {
        this.id = id;
    }
}
