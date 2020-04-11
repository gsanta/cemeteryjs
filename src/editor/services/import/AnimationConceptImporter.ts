
import { ConceptType } from '../../views/canvas/models/concepts/Concept';
import { AnimationConcept, AnimationCondition } from '../../views/canvas/models/meta/AnimationConcept';
import { IConceptImporter } from './IConceptImporter';
import { ConceptGroupJson } from './ImportService';

export interface AnimationJson {
    _attributes: {
        "data-id": string,
        "data-type": string,
    }

    g: ElementalAnimationJson[];
}

interface ElementalAnimationJson {
    _attributes: {
        "data-name": string,
        "data-condition": string,
    }
}

export interface AnimationGroupJson extends ConceptGroupJson {
    g: AnimationJson[];
}

export class AnimationConceptImporter implements IConceptImporter {
    type = ConceptType.AnimationConcept;
    private addConcept: (concept: AnimationConcept) => void;

    constructor(addConcept: (concept: AnimationConcept) => void) {
        this.addConcept = addConcept;
    }

    import(group: AnimationGroupJson): void {
        const animationJsons =  group.g.length ? <AnimationJson[]> group.g : [<AnimationJson> <unknown> group.g];

        animationJsons.forEach(animationJson => {
            const id = animationJson._attributes['data-id'];
            const animationConcept = new AnimationConcept();
            animationConcept.id = id;

            const elementalAnimationJsons =  animationJson.g.length ? <ElementalAnimationJson[]> animationJson.g : [<ElementalAnimationJson> <unknown> animationJson.g];
            elementalAnimationJsons.forEach(elementalAnimJson => {
                animationConcept.addAnimation({
                    name: elementalAnimJson._attributes['data-name'],
                    condition: <AnimationCondition> elementalAnimJson._attributes['data-condition']
                });
            });


            this.addConcept(animationConcept);
        });
    }
}