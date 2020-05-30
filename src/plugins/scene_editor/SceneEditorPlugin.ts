import { AbstractPlugin, calcOffsetFromDom } from '../../core/AbstractPlugin';
import { Point } from '../../core/geometry/shapes/Point';
import { Registry } from '../../core/Registry';
import { LayoutType } from '../../core/services/PluginService';
import { UpdateTask } from '../../core/services/UpdateServices';
import { Camera2D } from '../common/camera/Camera2D';
import { AbstractPluginImporter } from '../common/io/AbstractPluginImporter';
import { SceneEditorImporter } from './io/import/SceneEditorImporter';
import { LevelSettings } from './settings/LevelSettings';
import { MeshSettings } from './settings/MeshSettings';
import { PathSettings } from './settings/PathSettings';
import { SceneEditorExporter } from './io/export/SceneEditorExporter';

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
        return new Camera2D(registry, new Point(screenSize.x, screenSize.y));
    } else {
        return new Camera2D(registry, new Point(100, 100));
    }
}

export enum CanvasTag {
    Selected = 'selected',
    Hovered = 'hovered'
}

export class SceneEditorPlugin extends AbstractPlugin {
    static id = 'scene-editor-plugin';
    
    visible = true;
    allowedLayouts = new Set([LayoutType.Single, LayoutType.Double]);

    private camera: Camera2D;

    constructor(registry: Registry) {
        super(registry);

        this.camera = cameraInitializer(SceneEditorPlugin.id, registry);

        this.selectedTool = this.registry.tools.rectangle;

        this.settings = [
            new MeshSettings(this.registry),
            new PathSettings(),
            new LevelSettings(this.registry)
        ];

        this.exporter = new SceneEditorExporter(this, this.registry);
        this.importer = new SceneEditorImporter(this.registry);
    }

    getStore() {
        return this.registry.stores.canvasStore;
    }

    getId() {
        return SceneEditorPlugin.id;
    }

    resize(): void {
        const screenSize = getScreenSize(SceneEditorPlugin.id);
        screenSize && this.camera.resize(screenSize);
        this.registry.tools.zoom.resize();
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
        this.camera = cameraInitializer(SceneEditorPlugin.id, this.registry);
        this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas);
    }
}