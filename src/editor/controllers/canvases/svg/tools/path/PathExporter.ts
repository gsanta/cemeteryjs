import { SvgCanvasController } from "../../SvgCanvasController";
import * as ReactDOMServer from 'react-dom/server';
import {PathComponentFactory} from './PathComponentFactory';
import { IToolExporter } from "../IToolExporter";
import { ToolType } from "../Tool";

export class PathExporter implements IToolExporter {
    type: ToolType.PATH;
    private canvasController: SvgCanvasController;

    constructor(canvasController: SvgCanvasController) {
        this.canvasController = canvasController;
    }

    export(): string {
        const pathes = this.canvasController.canvasStore.pathes;

        const pathFactory = new PathComponentFactory(this.canvasController);

        return ReactDOMServer.renderToString(pathFactory.create());
    }
}