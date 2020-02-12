import { ViewType } from "../../../../../../common/views/View";
import { PathComponent } from "../../../../../gui/windows/canvas/PathComponent";
import { EditorFacade } from "../../../../EditorFacade";
import { IViewExporter } from "../IToolExporter";
import React = require("react");
import { PathView } from "../../../../../../common/views/PathView";
import { CanvasController } from "../../CanvasController";
import { CanvasItemTag } from "../../models/CanvasItem";

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
                onMouseOut={() => this.controller.mouseController.unhover()}
            />
        });

        return pathes.length > 0 ? 
            (
                <g data-view-type={ViewType.Path}>{pathes}</g> 
            )
            : null;
    }
}