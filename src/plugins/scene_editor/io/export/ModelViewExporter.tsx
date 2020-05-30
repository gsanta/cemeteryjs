import { ConceptType } from '../../../../core/models/views/View';
import { Registry } from '../../../../core/Registry';
import { IViewExporter } from '../../../common/io/IViewExporter';
import { ModelViewContainerComponent } from '../../components/ModelViewComponent';
import React = require("react");
import ReactDOMServer = require('react-dom/server');

export class ModelViewExporter implements IViewExporter {
    viewType = ConceptType.ModelConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(): string {
        return ReactDOMServer.renderToStaticMarkup(<ModelViewContainerComponent registry={this.registry} renderWithSettings={true}/>);
    }
}