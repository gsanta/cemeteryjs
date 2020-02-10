import { CanvasController } from './CanvasController';
import { ICanvasExporter } from '../ICanvasExporter';
import * as ReactDOMServer from 'react-dom/server';
import * as React from 'react';

export class SvgCanvasExporter implements ICanvasExporter {
    private canvasController: CanvasController;

    constructor(canvasController: CanvasController) {
        this.canvasController = canvasController;
    }

    export(): string {
        return ReactDOMServer.renderToStaticMarkup(this.renderRoot());
    }

    private renderRoot(): JSX.Element {
        const views = this.canvasController.toolService.getAllToolExporters().map(factory => factory.export(true));
        return (
            <svg
                data-wg-pixel-size="10" data-wg-width="3000" data-wg-height="3000" width="1000" height="1000">
                {views}
            </svg>
        )
    }
}