import * as React from 'react';
import { AllNodeConnectionsComponent } from '../../../plugins/node_editor/components/NodeConnectionComponent';
import { NodeGroupComponent } from '../../../plugins/node_editor/components/NodeGroupComponent';
import { ConceptType, View } from "../../models/views/View";
import { Registry } from "../../Registry";
import { IConceptExporter } from "./IConceptExporter";

export class ActionConceptExporter implements IConceptExporter {
    type = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(hover?: (view: View) => void, unhover?: (view: View) => void): JSX.Element {
        return (
            <React.Fragment>
                <NodeGroupComponent registry={this.registry} renderWithSettings={true} hover={hover} unhover={unhover}/>
                <AllNodeConnectionsComponent registry={this.registry} renderWithSettings={false} hover={hover} unhover={unhover}/>
            </React.Fragment>
        );
    }

    exportToFile(hover?: (item: View) => void, unhover?: (item: View) => void): JSX.Element {
        return (
            <React.Fragment>
                <NodeGroupComponent registry={this.registry} renderWithSettings={false} hover={hover} unhover={unhover}/>
                <AllNodeConnectionsComponent registry={this.registry} renderWithSettings={false} hover={hover} unhover={unhover}/>
            </React.Fragment>
        );
    }
}