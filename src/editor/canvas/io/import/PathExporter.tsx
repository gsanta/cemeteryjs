import { ViewType } from "../../models/views/View";
import { IViewExporter } from "../../tools/IToolExporter";
import React = require("react");
import { PathView } from "../../models/views/PathView";
import { CanvasItemTag } from "../../models/CanvasItem";
import { PathComponent } from "../../gui/PathComponent";
import { CanvasController } from "../../CanvasController";

export class PathExporter implements IViewExporter {
    type = ViewType.Path;
    private controller: CanvasController;

    constructor(controller: CanvasController) {
        this.controller = controller;
    }

    export(onlyData = false): JSX.Element {
        const pathes = this.controller.viewStore.getPathes().map(path => {
            return <PathComponent
                onlyData={onlyData}
                item={path}
                isHovered={this.controller.viewStore.getHoveredView() === path}
                isSelected={this.controller.viewStore.getTags(path).has(CanvasItemTag.SELECTED)}
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