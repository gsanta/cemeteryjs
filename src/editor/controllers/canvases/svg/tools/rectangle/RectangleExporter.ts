import { SvgCanvasController } from "../../SvgCanvasController";
import * as ReactDOMServer from 'react-dom/server';
import { IToolExporter } from "../IToolExporter";
import { ToolType } from "../Tool";

export class RectangleExporter implements IToolExporter {
    type: ToolType.RECTANGLE;
    
    private canvasController: SvgCanvasController;

    constructor(canvasController: SvgCanvasController) {
        this.canvasController = canvasController;
    }

    export(): string {
        const pathes = this.canvasController.canvasStore.pathes;


        return ReactDOMServer.renderToString(null);
    }
}