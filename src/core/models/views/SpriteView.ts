import { View } from "./View";
import { Sprite } from "babylonjs";
import { SpriteObj } from "../game_objects/SpriteObj";


export const SpriteViewType = 'SpriteView';

export class SpriteView extends View {
    viewType = SpriteViewType;

    obj: SpriteObj;
}