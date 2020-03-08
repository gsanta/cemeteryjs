import { IViewExporter } from "../../tools/IToolExporter";
import React = require("react");
import { PathComponent } from "../../gui/PathComponent";
import { CanvasItemTag } from "../../models/CanvasItem";
import { PathView } from "../../models/views/PathView";
import { ViewType, View } from "../../models/views/View";
import { Stores } from '../../../../Stores';

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