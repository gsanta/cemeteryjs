import { ViewType } from "../../../../../../common/views/View";
import { PathComponent } from "../../../../../gui/canvases/svg/PathComponent";
import { EditorFacade } from "../../../../EditorFacade";
import { IViewExporter } from "../IToolExporter";
import React = require("react");
import { PathView } from "../../../../../../common/views/PathView";

export class PathExporter implements IViewExporter {
    type = ViewType.Path;
    private services: EditorFacade;

    constructor(services: EditorFacade) {
        this.services = services;
    }

    export(onlyData = false): JSX.Element {
        const pathes = this.services.viewStore.getPathes().map(arrow => {
            return <PathComponent
                onlyData={onlyData}
                item={arrow}
                onMouseOver={(item: PathView) => this.services.svgCanvasController.mouseController.hover(item)}
                onMouseOut={() => this.services.svgCanvasController.mouseController.unhover()}
            />
        });

        return pathes.length > 0 ? 
            (
                <g data-view-type={ViewType.Path}>{pathes}</g> 
            )
            : null;
    }
}