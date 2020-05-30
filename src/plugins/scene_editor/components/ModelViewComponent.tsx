import { ViewComponent } from "../../common/ViewComponent";
import { ConceptType } from "../../../core/models/views/View";
import * as React from 'react';
import { GroupProps } from "../../InstanceProps";


export class ModelViewComponent extends ViewComponent<any> {
    render(): JSX.Element {
        return <g
            key={this.props.item.id}
            data-id={this.props.item.id}
            data-model-path={this.props.item.modelPath}
            data-texture-path={this.props.item.texturePath}
            data-thumbnail-path={this.props.item.thumbnailPath}
        />;
    }
}

export function ModelViewContainerComponent(props: GroupProps) {
    const models = props.registry.stores.canvasStore.getModelConcepts().map(item => {
        return (
            <ModelViewComponent
                item={item}
                renderWithSettings={props.renderWithSettings}
                registry={props.registry}
                hover={props.hover}
                unhover={props.unhover}
            />
        )
    });

    return models.length > 0 ? 
        (
            <g data-view-type={ConceptType.ModelConcept} key={ConceptType.ModelConcept}>{models}</g> 
        )
        : null;
}