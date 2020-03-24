import { IConceptExporter } from "../../views/canvas/tools/IConceptExporter";
import React = require("react");
import { PathComponent } from "./PathComponent";
import { Stores } from '../../stores/Stores';
import { CanvasItemType, CanvasItem } from "../../views/canvas/models/CanvasItem";

export class PathConceptExporter implements IConceptExporter {
    type = CanvasItemType.PathConcept;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    export(hover?: (canvasItem: CanvasItem) => void, unhover?: (canvasItem: CanvasItem) => void): JSX.Element {
        const pathes = this.getStores().canvasStore.getPathConcepts().map(path => {
            return <PathComponent
                key={path.name}
                onlyData={!hover}
                item={path}
                isHovered={this.getStores().hoverStore.contains(path)}
                isSelected={this.getStores().selectionStore.contains(path)}
                onMouseOver={(item: CanvasItem) => hover ?  hover(item) : () => undefined}
                onMouseOut={(item: CanvasItem) => unhover ? unhover(item) : () => undefined}
                stores={this.getStores()}
            />
        });

        return pathes.length > 0 ? 
            (
                <g data-view-type={CanvasItemType.PathConcept}>{pathes}</g> 
            )
            : null;
    }
}