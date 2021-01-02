import { MeshObj } from "../models/objs/MeshObj";


export interface IAnimationAdapter {
    startAnimation(meshObj: MeshObj, animationName: string): void;
    stopAnimation(meshObj: MeshObj, animationName: string): void;
    stopAllAnimations(meshObj: MeshObj): void;
}