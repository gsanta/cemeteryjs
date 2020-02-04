import { SvgCanvasController } from "../../SvgCanvasController";
import { PathComponent } from "../../../../../gui/canvases/svg/PathComponent";
import React = require("react");
import { ToolType } from "../Tool";
import { IToolExporter } from "../IToolExporter";
import { PathView } from "./PathTool";
import { EditorFacade } from "../../../../EditorFacade";

export class PathExporter implements IToolExporter {
    type = ToolType.PATH;
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
                <g data-tool-type={ToolType.PATH}>{pathes}</g> 
            )
            : null;
    }
}