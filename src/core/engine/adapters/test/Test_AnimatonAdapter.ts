import { MeshObj } from "../../../models/objs/MeshObj";
import { IAnimationAdapter } from "../../IAnimationAdapter";


export class Test_AnimationAdapter implements IAnimationAdapter {
    startAnimation(meshObj: MeshObj, animationName: string): void {}
    stopAnimation(meshObj: MeshObj, animationName: string): void {}
    stopAllAnimations(meshObj: MeshObj): void {}
    getAnimationGroups(meshObj: MeshObj): string[] { return []; }
}