import { WindowController, CanvasViewSettings } from '../../common/WindowController';
import { IPointerService } from '../../common/services/IPointerService';
import { KeyboardHandler } from '../../common/services/KeyboardHandler';
import { MouseHandler } from '../../common/services/MouseHandler';
import { Editor } from '../../Editor';
import { ServiceLocator } from '../../ServiceLocator';
import { MeshForm } from './forms/MeshForm';
import { PathForm } from './forms/PathForm';
import { CanvasExporter } from './io/export/CanvasExporter';
import { PathExporter } from './io/export/PathExporter';
import { RectangleExporter } from './io/export/RectangleExporter';
import { CanvasImporter } from './io/import/CanvasImporter';
import { PathImporter } from './io/import/PathImporter';
import { MeshViewImporter } from './io/import/RectangleImporter';
import { Model3DController } from './Model3DController';
import { CanvasPointerService } from './services/CanvasPointerService';
import { UpdateService, UpdateTask } from '../../common/services/UpdateServices';
import { ToolType } from './tools/Tool';
import { ToolService } from './tools/ToolService';
import { Stores } from '../../Stores';
import { FeedbackStore } from './models/FeedbackStore';
import { PathView } from './models/views/PathView';
import { LevelForm } from './forms/LevelForm';

export class CanvasWindow extends WindowController {
    name = '2D View';
    static id = 'svg-canvas-controller';
    visible = true;

    feedbackStore: FeedbackStore;

    mouseController: MouseHandler;
    keyboardHandler: KeyboardHandler;
    importer: CanvasImporter;
    exporter: CanvasExporter;
    model3dController: Model3DController;

    toolService: ToolService;
    updateService: UpdateService;
    pointer: IPointerService;
    
    meshViewForm: MeshForm;
    pathForm: PathForm;
    levelForm: LevelForm;

    constructor(editor: Editor, getServices: () => ServiceLocator, getStores: () => Stores) {
        super(editor, getServices, getStores);

        this.updateService = new UpdateService(this, getServices, getStores);
        this.feedbackStore = new FeedbackStore();
        
        this.mouseController = new MouseHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        this.importer = new CanvasImporter(
            [
                new MeshViewImporter(rect => this.getStores().viewStore.addRect(rect)),
                new PathImporter((path: PathView) => this.getStores().viewStore.addPath(path))
            ],
            this
        );
        this.exporter = new CanvasExporter(this, [new RectangleExporter(this, this.getStores), new PathExporter(this, this.getStores)]);
        this.model3dController = new Model3DController(this, this.getServices());

        this.toolService = new ToolService(this, this.getServices, this.getStores);

        this.meshViewForm = new MeshForm(this, this.getServices, this.getStores, this.editor.eventDispatcher);
        this.pathForm = new PathForm();
        this.levelForm = new LevelForm(this, this.getServices, this.getStores);
        this.pointer = new CanvasPointerService(this);
    }

    setSelectedTool(toolType: ToolType) {
        if (this.toolService.selectedTool) {
            this.toolService.getActiveTool().unselect();
        }
        this.toolService.selectedTool = toolType;
        this.toolService.getActiveTool().select();
        this.updateService.runImmediately(UpdateTask.RepaintSettings);
    }

    getId() {
        return CanvasWindow.id;
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