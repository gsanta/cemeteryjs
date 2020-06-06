import { AbstractPlugin, calcOffsetFromDom } from '../../core/AbstractPlugin';
import { Point } from '../../core/geometry/shapes/Point';
import { Registry } from '../../core/Registry';
import { LayoutType } from '../../core/services/PluginService';
import { Camera2D } from '../common/camera/Camera2D';
import { SceneEditorExporter } from './io/SceneEditorExporter';
import { SceneEditorImporter } from './io/SceneEditorImporter';
import { LevelSettings } from './settings/LevelSettings';
import { MeshSettings } from './settings/MeshSettings';
import { PathSettings } from './settings/PathSettings';
import { Rectangle } from '../../core/geometry/shapes/Rectangle';

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

export const DUMMY_CAMERA_SIZE = new Point(100, 100);

function cameraInitializer(canvasId: string, registry: Registry) {
    const screenSize = getScreenSize(canvasId);
    if (screenSize) {
        return new Camera2D(registry, new Point(screenSize.x, screenSize.y));
    } else {
        return new Camera2D(registry, DUMMY_CAMERA_SIZE);
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
        this.renderFunc && this.renderFunc();
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
}