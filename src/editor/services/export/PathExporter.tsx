import { IViewExporter } from "../../windows/canvas/tools/IToolExporter";
import React = require("react");
import { PathComponent } from "../../windows/canvas/gui/PathComponent";
import { CanvasItemTag } from "../../windows/canvas/models/CanvasItem";
import { PathView } from "../../windows/canvas/models/views/PathView";
import { ViewType, View } from "../../windows/canvas/models/views/View";
import { Stores } from '../../stores/Stores';

export class PathExporter implements IViewExporter {
    type = ViewType.Path;
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    export(hover?: (view: View) => void, unhover?: (view: View) => void): JSX.Element {
        const pathes = this.getStores().viewStore.getPathes().map(path => {
            return <PathComponent
                onlyData={!hover}
                item={path}
                isHovered={this.getStores().viewStore.getHoveredView() === path}
                isSelected={this.getStores().viewStore.getTags(path).has(CanvasItemTag.SELECTED)}
                onMouseOver={(item: PathView) => hover ?  hover(item) : () => undefined}
                onMouseOut={(item: PathView) => unhover ? unhover(item) : () => undefined}
            />
        });

        return pathes.length > 0 ? 
            (
                <g data-view-type={ViewType.Path}>{pathes}</g> 
            )
            : null;
    }
}