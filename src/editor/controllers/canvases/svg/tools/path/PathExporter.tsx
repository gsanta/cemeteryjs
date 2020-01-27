import { SvgCanvasController } from "../../SvgCanvasController";
import { PathComponent } from "../../../../../gui/canvases/svg/PathComponent";
import React = require("react");
import { ToolType } from "../Tool";
import { IToolExporter } from "../IToolExporter";

export class PathExporter implements IToolExporter {
    type = ToolType.PATH;
    private canvasController: SvgCanvasController;

    constructor(canvasController: SvgCanvasController) {
        this.canvasController = canvasController;
    }

    export(): JSX.Element {
        const pathes = this.canvasController.canvasStore.pathes.map(arrow => <PathComponent item={arrow}/>);

        return pathes.length > 0 ? <g data-tool-type={ToolType.PATH}>{pathes}</g> : null;
    }
}