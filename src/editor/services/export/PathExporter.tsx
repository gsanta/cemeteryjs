import { IViewExporter } from "../../windows/canvas/tools/IToolExporter";
import React = require("react");
import { PathComponent } from "../../windows/canvas/gui/PathComponent";
import { CanvasItemTag } from "../../windows/canvas/models/CanvasItem";
import { PathConcept } from "../../windows/canvas/models/concepts/PathConcept";
import { ConceptType, Concept } from "../../windows/canvas/models/concepts/Concept";
import { Stores } from '../../stores/Stores';

export class PathExporter implements IViewExporter {
    type = ConceptType.Path;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    export(hover?: (view: Concept) => void, unhover?: (view: Concept) => void): JSX.Element {
        const pathes = this.getStores().viewStore.getPathes().map(path => {
            return <PathComponent
                onlyData={!hover}
                item={path}
                isHovered={this.getStores().viewStore.getHoveredView() === path}
                isSelected={this.getStores().viewStore.getTags(path).has(CanvasItemTag.SELECTED)}
                onMouseOver={(item: PathConcept) => hover ?  hover(item) : () => undefined}
                onMouseOut={(item: PathConcept) => unhover ? unhover(item) : () => undefined}
            />
        });

        return pathes.length > 0 ? 
            (
                <g data-view-type={ConceptType.Path}>{pathes}</g> 
            )
            : null;
    }
}