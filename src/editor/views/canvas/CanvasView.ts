import { Point } from '../../../misc/geometry/shapes/Point';
import { Editor } from '../../Editor';
import { ServiceLocator } from '../../services/ServiceLocator';
import { Stores } from '../../stores/Stores';
import { CanvasViewSettings, View } from '../View';
import { LevelSettings } from './settings/LevelSettings';
import { MeshSettings } from './settings/MeshSettings';
import { PathSettings } from './settings/PathSettings';
import { MeshDimensionService } from './MeshDimensionService';
import { Camera, nullCamera } from './models/Camera';
import { FeedbackStore } from './models/FeedbackStore';
import { CameraTool } from './tools/CameraTool';
import { DeleteTool } from './tools/DeleteTool';
import { MoveTool } from './tools/MoveTool';
import { PathTool } from './tools/PathTool';
import { PointerTool } from './tools/PointerTool';
import { RectangleTool } from './tools/RectangleTool';
import { SelectTool } from './tools/SelectTool';
import { ToolType } from './tools/Tool';
import { IViewExporter } from '../../services/export/IViewExporter';
import { CanvasViewExporter } from '../../services/export/CanvasViewExporter';
import { IViewImporter } from '../../services/import/IViewImporter';
import { CanvasViewImporter } from '../../services/import/CanvasViewImporter';

export function cameraInitializer(canvasId: string) {
    if (typeof document !== 'undefined') {
        const svg: HTMLElement = document.getElementById(canvasId);

        if (svg) {
            const rect: ClientRect = svg.getBoundingClientRect();
            return new Camera(new Point(rect.width, rect.height));
        } else {
            return nullCamera;
        }
    } else {
        return nullCamera;
    }
}

function calcOffsetFromDom(bitmapEditorId: string): Point {
    if (typeof document !== 'undefined') {
        const editorElement: HTMLElement = document.getElementById(bitmapEditorId);
        if (editorElement) {
            const rect: ClientRect = editorElement.getBoundingClientRect();
            return new Point(rect.left - editorElement.scrollLeft, rect.top - editorElement.scrollTop);
        }
    }

    return new Point(0, 0);
}

export enum CanvasTag {
    Selected = 'selected',
    Hovered = 'hovered'
}

export class CanvasView extends View {
    static id = 'svg-canvas-controller';
    
    visible = true;
    feedbackStore: FeedbackStore;
    
    model3dController: MeshDimensionService;
    
    exporter: IViewExporter;
    importer: IViewImporter;
    private camera: Camera = nullCamera;

    constructor(editor: Editor, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(editor, getServices, getStores);

        this.getStores().viewStore.setActiveView(this);
        
        this.feedbackStore = new FeedbackStore();
        
        this.model3dController = new MeshDimensionService(this.getServices);

        this.tools = [
            new PointerTool(this, this.getServices, this.getStores),
            new CameraTool(this, this.getServices, this.getStores),
            new RectangleTool(this, this.getServices, this.getStores),
            new PathTool(this, this.getServices, this.getStores),
            new DeleteTool(this, this.getServices, this.getStores),
            new MoveTool(this, this.getServices, this.getStores),
            new SelectTool(this, this.getServices, this.getStores)
        ];

        this.activeTool = this.getToolByType(ToolType.RECTANGLE);

        this.settings = [
            new MeshSettings(this, this.getServices, this.getStores),
            new PathSettings(),
            new LevelSettings(this.getServices, this.getStores)
        ];

        this.exporter = new CanvasViewExporter(getStores);
        this.importer = new CanvasViewImporter(getStores);
    }

    getId() {
        return CanvasView.id;
    }

    resize(): void {
        (<CameraTool> this.getToolByType(ToolType.CAMERA)).resize();
    };

    isVisible(): boolean {
        return this.visible;
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }

    isEmpty(): boolean {
        return this.getStores().canvasStore.getAllConcepts().length === 0;
    }

    getOffset() {
        return calcOffsetFromDom(this.getId());
    }

    getCamera() {
        if (this.camera === nullCamera) {
            this.camera = cameraInitializer(CanvasView.id);
        }

        return this.camera;
    }

    setCamera(camera: Camera) {
        this.camera = camera;
    }

    viewSettings: CanvasViewSettings = {
        initialSizePercent: 44,
        minSizePixel: 300
    }
}