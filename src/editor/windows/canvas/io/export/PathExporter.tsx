import { IViewExporter } from "../../tools/IToolExporter";
import React = require("react");
import { PathComponent } from "../../gui/PathComponent";
import { CanvasWindow } from "../../CanvasWindow";
import { CanvasItemTag } from "../../models/CanvasItem";
import { PathView } from "../../models/views/PathView";
import { ViewType } from "../../models/views/View";

export class PathExporter implements IViewExporter {
    type = ViewType.Path;
    private controller: CanvasWindow;

    constructor(controller: CanvasWindow) {
        this.controller = controller;
    }

    export(onlyData = false): JSX.Element {
        const pathes = this.controller.stores.viewStore.getPathes().map(path => {
            return <PathComponent
                onlyData={onlyData}
                item={path}
                isHovered={this.controller.stores.viewStore.getHoveredView() === path}
                isSelected={this.controller.stores.viewStore.getTags(path).has(CanvasItemTag.SELECTED)}
                onMouseOver={(item: PathView) => this.controller.mouseController.hover(item)}
                onMouseOut={(item: PathView) => this.controller.mouseController.unhover(item)}
            />
        });

        return pathes.length > 0 ? 
            (
                <g data-view-type={ViewType.Path}>{pathes}</g> 
            )
            : null;
    }
}