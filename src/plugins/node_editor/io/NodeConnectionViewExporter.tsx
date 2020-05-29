import * as React from 'react';
import { ConceptType } from '../../../core/models/views/View';
import { Registry } from '../../../core/Registry';
import { IViewExporter } from '../../common/io/IViewExporter';
import { AllNodeConnectionsComponent } from '../components/NodeConnectionComponent';

export class NodeConnectionViewExporter implements IViewExporter {
    viewType: ConceptType.ActionNodeConnectionConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export() {
        return (
            <AllNodeConnectionsComponent registry={this.registry} renderWithSettings={false}/>
        );
    }
}