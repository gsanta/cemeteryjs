import { Editor } from '../../Editor';
import { ServiceLocator } from '../../services/ServiceLocator';
import { UpdateTask } from '../../services/UpdateServices';
import { Stores } from '../../stores/Stores';
import { IPointerHandler } from '../IPointerHandler';
import { KeyboardHandler } from '../KeyboardHandler';
import { MouseHandler } from '../MouseHandler';
import { CanvasViewSettings, ViewController } from '../ViewController';
import { LevelForm } from './forms/LevelForm';
import { MeshForm } from './forms/MeshForm';
import { PathForm } from './forms/PathForm';
import { Model3DController } from './Model3DController';
import { FeedbackStore } from './models/FeedbackStore';
import { CanvasPointerService } from './services/CanvasPointerService';
import { ToolType } from './tools/Tool';
import { ToolService } from './tools/ToolService';

export class CanvasView extends ViewController {
    name = '2D View';
    static id = 'svg-canvas-controller';
    visible = true;

    feedbackStore: FeedbackStore;

    mouseController: MouseHandler;
    keyboardHandler: KeyboardHandler;
    model3dController: Model3DController;

    toolService: ToolService;
    pointer: IPointerHandler;
    
    meshViewForm: MeshForm;
    pathForm: PathForm;
    levelForm: LevelForm;

    constructor(editor: Editor, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(editor, getServices, getStores);

        this.feedbackStore = new FeedbackStore();
        
        this.mouseController = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.model3dController = new Model3DController(this, this.getServices);

        this.toolService = new ToolService(this, this.getServices, this.getStores);

        this.meshViewForm = new MeshForm(this, this.getServices, this.getStores);
        this.pathForm = new PathForm();
        this.levelForm = new LevelForm(this.getServices, this.getStores);
        this.pointer = new CanvasPointerService(this, this.getServices, this.getStores);
    }

    setSelectedTool(toolType: ToolType) {
        if (this.toolService.selectedTool) {
            this.toolService.getActiveTool().unselect();
        }
        this.toolService.selectedTool = toolType;
        this.toolService.getActiveTool().select();
        this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
    }

    getId() {
        return CanvasView.id;
    }

    resize(): void {
        this.toolService.cameraTool.resize();
    };

    isVisible(): boolean {
        return this.visible;
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }

    activate(): void {
        // this.
    }

    isEmpty(): boolean {
        return this.getStores().viewStore.getViews().length === 0;
    }

    viewSettings: CanvasViewSettings = {
        initialSizePercent: 44,
        minSizePixel: 300
    }
}