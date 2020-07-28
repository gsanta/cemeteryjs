import { AbstractPlugin, calcOffsetFromDom } from '../../core/AbstractPlugin';
import { Point } from '../../core/geometry/shapes/Point';
import { sort } from '../../core/geometry/utils/Functions';
import { toDegree } from '../../core/geometry/utils/Measurements';
import { UI_Layout } from '../../core/gui_builder/elements/UI_Layout';
import { UI_SvgCanvas } from '../../core/gui_builder/elements/UI_SvgCanvas';
import { Registry } from '../../core/Registry';
import { UI_Region } from '../../core/UI_Plugin';
import { Camera2D } from '../common/camera/Camera2D';
import { PluginSettings } from '../common/PluginSettings';
import { toolFactory } from '../common/toolbar/toolFactory';
import { ToolType } from '../common/tools/Tool';
import { SceneEditorExporter } from './io/SceneEditorExporter';
import { SceneEditorImporter } from './io/SceneEditorImporter';
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

export const SceneEditorPluginId = 'scene-editor-plugin'; 

export class SceneEditorPlugin extends AbstractPlugin {
    id = SceneEditorPluginId;
    region = UI_Region.Canvas1;
    private camera: Camera2D;

    constructor(registry: Registry) {
        super(registry);
        
        [ToolType.Rectangle, ToolType.Path, ToolType.Select, ToolType.Delete, ToolType.Pointer, ToolType.Camera]
            .map(toolType => {
                this.addTool(toolFactory(toolType, this, registry));
            });

        this.camera = cameraInitializer(SceneEditorPluginId, registry);
        this.selectedTool = this.getToolById(ToolType.Rectangle);

        this.pluginSettings = new PluginSettings(
            [
                new MeshSettings(this, this.registry),
                new PathSettings(),
                new LevelSettings(this.registry)
            ]
        );

        this.exporter = new SceneEditorExporter(this, this.registry);
        this.importer = new SceneEditorImporter(this, this.registry);
    }

    getStore() {
        return this.registry.stores.canvasStore;
    }

    resize(): void {
        const screenSize = getScreenSize(SceneEditorPluginId);
        screenSize && this.camera.resize(screenSize);
        this.renderFunc && this.renderFunc();
    }

    destroy() {
        this.registry.stores.selectionStore.clear();
    }

    getOffset() {
        return calcOffsetFromDom(this.htmlElement);
    }

    getCamera() {
        return this.camera;
    }

    protected renderInto(layout: UI_Layout): void {
        const canvas = layout.svgCanvas(null);

        const toolbar = canvas.toolbar();
        
        let tool = toolbar.tool({controllerId: ToolType.Rectangle});
        tool.icon = 'brush';

        tool = toolbar.tool({controllerId: ToolType.Path});
        tool.icon = 'path';
        let tooltip = tool.tooltip();
        tooltip.label = 'Path tool';

        tool = toolbar.tool({controllerId: ToolType.Select});
        tool.icon = 'select';
        tooltip = tool.tooltip();
        tooltip.label = 'Select tool';

        tool = toolbar.tool({controllerId: ToolType.Delete});
        tool.icon = 'delete';
        tooltip = tool.tooltip();
        tooltip.label = 'Delete tool';

        tool = toolbar.tool({controllerId: ToolType.Move});
        tool.icon = 'pan';
        tooltip = tool.tooltip();
        tooltip.label = 'Pan tool';

        tool = toolbar.tool({controllerId: ToolType.Camera});
        tool.icon = 'zoom-in';
        tooltip = tool.tooltip();
        tooltip.label = 'Zoom in';

        tool = toolbar.tool({controllerId: ToolType.Camera});
        tool.icon = 'zoom-out';
        tooltip = tool.tooltip();
        tooltip.label = 'Zoom out';

        // tool = toolbar.tool({toolId: ToolType.});
        // tool.icon = 'undo';
        // tooltip = tool.tooltip();
        // tooltip.label = 'Undo';

        // tool = toolbar.tool();
        // tool.icon = 'redo';
        // tooltip = tool.tooltip();
        // tooltip.label = 'Redo';

        this.renderMeshViews(canvas);
        this.renderPathViews(canvas);
    }

    private renderMeshViews(canvas: UI_SvgCanvas) {
        const views = getSortedMeshViews(this.registry).map(item => {
            const group = canvas.group(item.id);
            group.transform = `translate(${item.dimensions.topLeft.x} ${item.dimensions.topLeft.y}) rotate(${toDegree(item.getRotation())} ${item.dimensions.getWidth() / 2} ${item.dimensions.getHeight() / 2})`;
            const rect = group.rect();
            rect.width = item.dimensions.getWidth();
            rect.height = item.dimensions.getHeight();

            let thumbnail: JSX.Element = null;
            const thumbnailModel = this.registry.stores.assetStore.getAssetById(item.thumbnailId);
    
            if (thumbnailModel && thumbnailModel.data) {
                const image = group.image();
                image.href = thumbnailModel.data;
                image.width = item.dimensions.getWidth();
                image.height = item.dimensions.getHeight();
            }
    
            return thumbnail;
        });
    }

    private renderPathViews(canvas: UI_SvgCanvas) {

    }
}

function getSortedMeshViews(registry: Registry) {
    let items = [...registry.stores.canvasStore.getMeshViews()];
    return sort(items, (a, b) => a.layer - b.layer);
}