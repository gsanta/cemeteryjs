import { SvgCanvasController } from "../../SvgCanvasController";
import { PathComponent } from "../../../../../gui/canvases/svg/PathComponent";
import React = require("react");
import { IToolComponentFactory } from "../IToolComponentFactory";
import { ToolType } from "../Tool";

export class PathComponentFactory implements IToolComponentFactory {
    type = ToolType.PATH;
    private canvasController: SvgCanvasController;

    constructor(canvasController: SvgCanvasController) {
        this.canvasController = canvasController;
    }

    create(): JSX.Element {
        const pathes = this.canvasController.canvasStore.pathes.map(arrow => <PathComponent item={arrow}/>);

        return <g>{pathes}</g>
    }
}