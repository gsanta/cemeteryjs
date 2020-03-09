import { Stores } from '../../stores/Stores';
import { Camera } from '../../views/canvas/models/Camera';
import { CanvasView } from '../../views/canvas/CanvasView';

export interface ViewExporter {
    export(): string;
}

export class ExportService {
    serviceName = 'export-service';
    private viewExporters: ViewExporter[] = [];
    private getStores: () => Stores;

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
    }

    export(): string {
        const exports = this.viewExporters.map(exporter => exporter.export());
        return this.createRoot(exports.join(''));
    }

    registerViewExporter(viewExporter: ViewExporter) {
        this.viewExporters.push(viewExporter)
    }

    private createRoot(content: string): string {
        const camera = this.getStores().viewStore.getViewById(CanvasView.id).getCamera() as Camera;

        const root = (
            '<svg data-wg-width="3000" data-wg-height="3000" width="1000" height="1000"' + 
            ` data-zoom="${camera.getScale()}" data-translate="${camera.getViewBox().topLeft.negate().toString()}">`
        );

        const rootClose = '</svg>';

        return `${root}${content}${rootClose}`;
    }
}