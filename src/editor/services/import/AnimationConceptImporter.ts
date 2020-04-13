
import { ConceptType } from '../../views/canvas/models/concepts/Concept';
import { AnimationConcept, AnimationCondition } from '../../views/canvas/models/meta/AnimationConcept';
import { IConceptImporter } from './IConceptImporter';
import { ConceptGroupJson } from './ImportService';
import { Stores } from '../../stores/Stores';

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
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
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

            this.getStores().canvasStore.addMeta(animationConcept);
        });
    }
}