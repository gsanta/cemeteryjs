
import { Registry } from '../../Registry';
import { AnimationConcept, AnimationCondition } from '../../models/meta/AnimationConcept';
import { IConceptImporter } from './IConceptImporter';
import { ConceptGroupJson } from './ImportService';
import { ConceptType } from '../../models/concepts/Concept';

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
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
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

            this.registry.stores.canvasStore.addMeta(animationConcept);
        });
    }
}