import { AnimationConcept, ElementalAnimation } from "../../models/meta/AnimationConcept";
import { ConceptType, View } from '../../models/views/View';
import { Registry } from '../../Registry';
import { IConceptExporter } from "./IConceptExporter";
import React = require("react");
import { VisualConcept } from "../../models/concepts/VisualConcept";

export class AnimationConceptExporter implements IConceptExporter {
    type = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }


    export(hover?: (view: VisualConcept) => void, unhover?: (view: VisualConcept) => void): JSX.Element {
        const animationConcepts = [...this.registry.stores.canvasStore.getAnimationConcepts()].map(animConcept => this.exportAnimationConcept(animConcept));

        return animationConcepts.length > 0 ? <g data-concept-type={ConceptType.AnimationConcept}>{animationConcepts}</g> : null;
    }

    exportToFile(hover?: (item: VisualConcept) => void, unhover?: (item: VisualConcept) => void): JSX.Element {
        return this.export(hover, unhover);
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