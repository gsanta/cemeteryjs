import { Point } from '../../../misc/geometry/shapes/Point';
import { Registry } from '../../Registry';
import { CanvasViewExporter } from '../../services/export/CanvasViewExporter';
import { IViewExporter } from '../../services/export/IViewExporter';
import { CanvasViewImporter } from '../../services/import/CanvasViewImporter';
import { IViewImporter } from '../../services/import/IViewImporter';
import { UpdateTask } from '../../services/UpdateServices';
import { calcOffsetFromDom, View } from '../View';
import { CanvasCamera } from './CanvasCamera';
import { LevelSettings } from './settings/LevelSettings';
import { MeshSettings } from './settings/MeshSettings';
import { PathSettings } from './settings/PathSettings';

function getScreenSize(canvasId: string): Point {
    if (typeof document !== 'undefined') {
        const svg: HTMLElement = document.getElementById(canvasId);

        if (svg) {
            const rect: ClientRect = svg.getBoundingClientRect();
            return new Point(rect.width, rect.height);
        }
    }
    return undefined;
}

function cameraInitializer(canvasId: string, registry: Registry) {
    const screenSize = getScreenSize(canvasId);
    if (screenSize) {
        return new CanvasCamera(registry, new Point(screenSize.x, screenSize.y));
    } else {
        return new CanvasCamera(registry, new Point(100, 100));
    }
}

export enum CanvasTag {
    Selected = 'selected',
    Hovered = 'hovered'
}

export class CanvasView extends View {
    static id = 'svg-canvas-controller';
    
    visible = true;
    
    exporter: IViewExporter;
    importer: IViewImporter;
    private camera: CanvasCamera;

    constructor(registry: Registry) {
        super(registry);

        this.camera = cameraInitializer(CanvasView.id, registry);

        this.registry.services.view.setActiveView(this);

        this.selectedTool = this.registry.services.tools.rectangle;

        this.settings = [
            new MeshSettings(this.registry),
            new PathSettings(),
            new LevelSettings(this.registry)
        ];

        this.exporter = new CanvasViewExporter(this.registry);
        this.importer = new CanvasViewImporter(this.registry);
    }

    getId() {
        return CanvasView.id;
    }

    resize(): void {
        this.camera.resize(getScreenSize(CanvasView.id));
        this.registry.services.tools.zoom.resize();
        this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas);
    };

    isVisible(): boolean {
        return this.visible;
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }

    getOffset() {
        return calcOffsetFromDom(this.getId());
    }

    getCamera() {
        return this.camera;
    }

    updateCamera() {
        this.camera = cameraInitializer(CanvasView.id, this.registry);
        this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas);
    }
}