import * as React from 'react';
import { NodeGroupComponent } from '../../../plugins/action_editor/components/NodeGroupComponent';
import { AllNodeConnectionsComponent } from '../../../plugins/action_editor/components/NodeConnectionComponent';
import { ConceptType, View } from "../../models/views/View";
import { Registry } from "../../Registry";
import { IConceptExporter } from "./IConceptExporter";
import { VisualConcept } from '../../models/concepts/VisualConcept';

export class ActionConceptExporter implements IConceptExporter {
    type = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(hover?: (view: VisualConcept) => void, unhover?: (view: VisualConcept) => void): JSX.Element {
        return (
            <React.Fragment>
                <NodeGroupComponent registry={this.registry} renderWithSettings={true} hover={hover} unhover={unhover}/>
                <AllNodeConnectionsComponent registry={this.registry} renderWithSettings={false} hover={hover} unhover={unhover}/>
            </React.Fragment>
        );
    }

    exportToFile(hover?: (item: VisualConcept) => void, unhover?: (item: VisualConcept) => void): JSX.Element {
        return (
            <React.Fragment>
                <NodeGroupComponent registry={this.registry} renderWithSettings={false} hover={hover} unhover={unhover}/>
                <AllNodeConnectionsComponent registry={this.registry} renderWithSettings={false} hover={hover} unhover={unhover}/>
            </React.Fragment>
        );
    }
}