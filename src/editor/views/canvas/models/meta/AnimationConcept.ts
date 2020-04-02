import { MetaConcept } from "./MetaConcept";
import { Point } from "../../../../../misc/geometry/shapes/Point";
import { EditPoint } from "../feedbacks/EditPoint";
import { ConceptType } from "../concepts/Concept";

export enum AnimationCondition {
    Default = 'Default',
    RotateLeft =  'RotateLeft',
    RotateRight =  'RotateRight',
}

export interface SimpleAnimation {
    name: string;
    condition: AnimationCondition;
}


export class AnimationConcept implements MetaConcept {
    type = ConceptType.AnimationConcept;
    id: string;

    animations: SimpleAnimation[] = [];

    getAnimationByCond(cond: AnimationCondition) {
        return this.animations.find(anim => anim.condition === cond);
    }

    addAnimation(simpleAnimation: SimpleAnimation) {
        const index = this.animations.findIndex(anim => anim.condition === simpleAnimation.condition);

        if (index !== -1) {
            this.animations[index] = simpleAnimation;
        } else {
            this.animations.push(simpleAnimation);
        }
    }
    
    editPoints: EditPoint[] = []
    dimensions = undefined;
    deleteEditPoint(editPoint: EditPoint): void {}
    move(delta: Point): void {}
    moveEditPoint(editPoint: EditPoint, delta: Point): void {}
}