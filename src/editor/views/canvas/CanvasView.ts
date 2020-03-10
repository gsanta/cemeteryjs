import { Editor } from '../../Editor';
import { ServiceLocator } from '../../services/ServiceLocator';
import { UpdateTask } from '../../services/UpdateServices';
import { Stores } from '../../stores/Stores';
import { IPointerHandler } from '../IPointerHandler';
import { KeyboardHandler } from '../KeyboardHandler';
import { MouseHandler } from '../MouseHandler';
import { CanvasViewSettings, View } from '../View';
import { LevelForm } from './forms/LevelForm';
import { MeshForm } from './forms/MeshForm';
import { PathForm } from './forms/PathForm';
import { Model3DController } from './Model3DController';
import { FeedbackStore } from './models/FeedbackStore';
import { CanvasPointerService } from './services/CanvasPointerService';
import { ToolType, Tool } from './tools/Tool';
import { CanvasExporter } from './CanvasExporter';
import { Camera, nullCamera } from './models/Camera';
import { Point } from '../../../misc/geometry/shapes/Point';
import { PointerTool } from './tools/PointerTool';
import { CameraTool } from './tools/CameraTool';
import { RectangleTool } from './tools/RectangleTool';
import { PathTool } from './tools/PathTool';
import { DeleteTool } from './tools/DeleteTool';
import { MoveTool } from './tools/MoveTool';
import { SelectTool } from './tools/SelectTool';

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

export class CanvasView extends View {
    name = '2D View';
    static id = 'svg-canvas-controller';
    visible = true;
    
    feedbackStore: FeedbackStore;
    
    mouseController: MouseHandler;
    keyboardHandler: KeyboardHandler;
    model3dController: Model3DController;
    
    pointer: IPointerHandler;
    
    meshViewForm: MeshForm;
    pathForm: PathForm;
    levelForm: LevelForm;
    exporter: CanvasExporter;
    private camera: Camera = nullCamera;

    constructor(editor: Editor, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(editor, getServices, getStores);

        this.getStores().viewStore.setActiveView(this);
        
        this.exporter = new CanvasExporter(this.getStores);
        this.getServices().exportService().registerViewExporter(this.exporter);
        this.feedbackStore = new FeedbackStore();
        
        this.mouseController = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.model3dController = new Model3DController(this, this.getServices);

        this.meshViewForm = new MeshForm(this, this.getServices, this.getStores);
        this.pathForm = new PathForm();
        this.levelForm = new LevelForm(this.getServices, this.getStores);
        this.pointer = new CanvasPointerService(this, this.getServices, this.getStores);

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
        return this.getStores().conceptStore.getViews().length === 0;
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