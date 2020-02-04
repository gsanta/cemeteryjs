import { SvgCanvasController } from "../../SvgCanvasController";
import { PathComponent } from "../../../../../gui/canvases/svg/PathComponent";
import React = require("react");
import { ToolType } from "../Tool";
import { IToolExporter } from "../IToolExporter";
import { PathView } from "./PathTool";

export class PathExporter implements IToolExporter {
    type = ToolType.PATH;
    private canvasController: SvgCanvasController;

    constructor(canvasController: SvgCanvasController, ) {
        this.canvasController = canvasController;
    }

    export(onlyData = false): JSX.Element {
        const pathes = this.canvasController.canvasStore.getPathes().map(arrow => {
            return <PathComponent
                onlyData={onlyData}
                item={arrow}
                onMouseOver={(item: PathView) => this.canvasController.mouseController.hover(item)}
                onMouseOut={() => this.canvasController.mouseController.unhover()}
            />
        });

        return pathes.length > 0 ? 
            (
                <g data-tool-type={ToolType.PATH}>{pathes}</g> 
            )
            : null;
    }
}