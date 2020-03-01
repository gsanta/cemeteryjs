import { CanvasController } from '../../CanvasController';
import * as ReactDOMServer from 'react-dom/server';
import * as React from 'react';
import { IViewExporter } from '../../tools/IToolExporter';
import { ViewType } from '../../models/views/View';

export class CanvasExporter {
    private canvasController: CanvasController;
    private viewExporters: IViewExporter[];

    constructor(canvasController: CanvasController, viewExporters: IViewExporter[]) {
        this.canvasController = canvasController;
        this.viewExporters = viewExporters;
    }

    export(): string {
        return ReactDOMServer.renderToStaticMarkup(this.renderRoot());
    }

    getViewExporter(viewType: ViewType) {
        return this.viewExporters.find(exporter => exporter.type === viewType);
    }

    private renderRoot(): JSX.Element {
        const views = this.viewExporters.map(exporter => exporter.export(true));
        
        return (
            <svg
                data-wg-pixel-size="10"
                data-wg-width="3000"
                data-wg-height="3000"
                width="1000"
                height="1000"
                data-zoom={this.canvasController.toolService.cameraTool.getCamera().getScale()}
                data-viewbox={this.canvasController.toolService.cameraTool.getCamera().getViewBox().toString()}
            >
                {views}
            </svg>
        )
    }
}