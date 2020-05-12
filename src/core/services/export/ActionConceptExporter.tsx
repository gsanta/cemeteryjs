import * as React from 'react';
import { ActionNodeGroupComponent } from '../../../plugins/action_editor/components/ActionNodeGroupComponent';
import { Concept, ConceptType } from "../../models/concepts/Concept";
import { Hoverable } from '../../models/Hoverable';
import { Registry } from "../../Registry";
import { IConceptExporter } from "./IConceptExporter";

export class ActionConceptExporter implements IConceptExporter {
    type = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(hover?: (view: Concept) => void, unhover?: (view: Concept) => void): JSX.Element {
        return <ActionNodeGroupComponent registry={this.registry} renderWithSettings={true} hover={hover} unhover={unhover}/>
    }

    exportToFile(hover?: (item: Hoverable) => void, unhover?: (item: Hoverable) => void): JSX.Element {
        return <ActionNodeGroupComponent registry={this.registry} renderWithSettings={false} hover={hover} unhover={unhover}/>
    }
}