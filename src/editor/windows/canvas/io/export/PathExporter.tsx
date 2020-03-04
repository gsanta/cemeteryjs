import { IViewExporter } from "../../tools/IToolExporter";
import React = require("react");
import { PathComponent } from "../../gui/PathComponent";
import { CanvasWindow } from "../../CanvasWindow";
import { CanvasItemTag } from "../../models/CanvasItem";
import { PathView } from "../../models/views/PathView";
import { ViewType } from "../../models/views/View";
import { Stores } from '../../../../Stores';

export class PathExporter implements IViewExporter {
    type = ViewType.Path;
    private controller: CanvasWindow;
    private getStores: () => Stores;

    constructor(controller: CanvasWindow, getStores: () => Stores) {
        this.controller = controller;
        this.getStores = getStores;
    }

    export(onlyData = false): JSX.Element {
        const pathes = this.getStores().viewStore.getPathes().map(path => {
            return <PathComponent
                onlyData={onlyData}
                item={path}
                isHovered={this.getStores().viewStore.getHoveredView() === path}
                isSelected={this.getStores().viewStore.getTags(path).has(CanvasItemTag.SELECTED)}
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