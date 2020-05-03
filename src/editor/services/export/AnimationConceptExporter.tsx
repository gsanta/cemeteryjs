import { Stores } from '../../stores/Stores';
import { Concept, ConceptType } from "../../models/concepts/Concept";
import { AnimationConcept, ElementalAnimation } from "../../models/meta/AnimationConcept";
import { IConceptExporter } from "./IConceptExporter";
import React = require("react");
import { Registry } from '../../Registry';

export class AnimationConceptExporter implements IConceptExporter {
    type = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }


    export(hover?: (view: Concept) => void, unhover?: (view: Concept) => void): JSX.Element {
        const animationConcepts = [...this.registry.stores.canvasStore.getAnimationConcepts()].map(animConcept => this.exportAnimationConcept(animConcept));

        return animationConcepts.length > 0 ? <g data-concept-type={ConceptType.AnimationConcept}>{animationConcepts}</g> : null;
    }

    private exportAnimationConcept(animationConcept: AnimationConcept) {
        const elementalAnimations = animationConcept.elementalAnimations.map(anim => this.exportElementalAnimation(anim));

        return (
            <g
                key={animationConcept.id}
                data-id={animationConcept.id}
                data-type={animationConcept.type} 
            >
                {elementalAnimations}
            </g>
        )
    }

    private exportElementalAnimation(elementalAnimation: ElementalAnimation): JSX.Element {
        return (
            <g key={elementalAnimation.name} data-name={elementalAnimation.name} data-condition={elementalAnimation.condition}/>
        )
    }
}