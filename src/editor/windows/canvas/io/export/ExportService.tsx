import * as ReactDOMServer from 'react-dom/server';
import * as React from 'react';
import { IViewExporter } from '../../tools/IToolExporter';
import { ViewType } from '../../models/views/View';
import { Stores } from '../../../../Stores';
import { RectangleExporter } from './RectangleExporter';
import { PathExporter } from './PathExporter';

export class ExportService {
    serviceName = 'export-service';
    private viewExporters: IViewExporter[];
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.viewExporters = [new RectangleExporter(getStores), new PathExporter(getStores)];
        this.getStores = getStores;
    }

    export(): string {
        return ReactDOMServer.renderToStaticMarkup(this.renderRoot());
    }

    getViewExporter(viewType: ViewType) {
        return this.viewExporters.find(exporter => exporter.type === viewType);
    }

    private renderRoot(): JSX.Element {
        const views = this.viewExporters.map(exporter => exporter.export());
        const camera = this.getStores().cameraStore.getCamera();
        return (
            <svg
                data-wg-pixel-size="10"
                data-wg-width="3000"
                data-wg-height="3000"
                width="1000"
                height="1000"
                data-zoom={camera.getScale()}
                data-translate={camera.getViewBox().topLeft.negate().toString()}
            >
                {views}
            </svg>
        )
    }
}