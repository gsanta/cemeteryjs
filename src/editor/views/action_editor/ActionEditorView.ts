import { Point } from '../../../misc/geometry/shapes/Point';
import { Registry } from '../../Registry';
import { UpdateTask } from '../../services/UpdateServices';
import { calcOffsetFromDom, View } from '../View';
import { CanvasCamera } from '../canvas/CanvasCamera';

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

export class ActionEditorView extends View {
    static id = 'action-editor-view';
    
    visible = true;
    
    private camera: CanvasCamera;

    constructor(registry: Registry) {
        super(registry);

        this.camera = cameraInitializer(ActionEditorView.id, registry);

        this.selectedTool = this.registry.services.tools.rectangle;
    }

    getId() {
        return ActionEditorView.id;
    }

    resize(): void {
        this.camera.resize(getScreenSize(ActionEditorView.id));
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
        this.camera = cameraInitializer(ActionEditorView.id, this.registry);
        this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas);
    }
}