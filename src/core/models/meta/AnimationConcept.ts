import { Point } from "../../geometry/shapes/Point";
import { EditPointView } from "../views/control/EditPointView";
import { ConceptType } from "../views/View";
import { MetaConcept } from "./MetaConcept";

export enum AnimationCondition {
    Default = 'Default',
    RotateLeft =  'RotateLeft',
    RotateRight =  'RotateRight',
    Move = 'Move'
}

export interface ElementalAnimation {
    name: string;
    condition: AnimationCondition;
}


export class AnimationConcept implements MetaConcept {
    type = ConceptType.AnimationConcept;
    id: string;

    elementalAnimations: ElementalAnimation[] = [];

    getAnimationByCond(cond: AnimationCondition) {
        return this.elementalAnimations.find(anim => anim.condition === cond);
    }

    addAnimation(simpleAnimation: ElementalAnimation) {
        const index = this.elementalAnimations.findIndex(anim => anim.condition === simpleAnimation.condition);

        if (index !== -1) {
            this.elementalAnimations[index] = simpleAnimation;
        } else {
            this.elementalAnimations.push(simpleAnimation);
        }
    }
    
    editPoints: EditPointView[] = []
    dimensions = undefined;
    move(delta: Point): void {}
}