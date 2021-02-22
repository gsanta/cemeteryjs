import { DragAndDropController } from "../../../../../core/controller/FormController";
import { UIController } from "../../../../../core/controller/UIController";
import { UI_Region } from "../../../../../core/models/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { NodeShape } from "../../../main/models/shapes/NodeShape";
import { NodeEditorPanelId } from "../../../NodeEditorModule";

export class NodeLibraryController extends UIController {
    constructor(registry: Registry) {
        super();

        this.dragNode = new DragNodeController(registry);
    }

    dragNode: DragNodeController;
}

export class DragNodeController extends DragAndDropController {
    private dropId: string;

    constructor(registry: Registry) {
        super(registry);

        this.registry.services.dragAndDropService.onDrop(() => this.onDrop());
    }

    onDndStart(dropId: string) {
        this.dropId = dropId;
        this.registry.ui.helper.hoveredPanel = this.registry.ui.helper.getPanel1(); 
        this.registry.services.dragAndDropService.dragStart();
        this.registry.services.render.reRender(UI_Region.Sidepanel, UI_Region.Canvas1);
        this.registry.services.render.reRenderAll();
    }

    onDndEnd() {
        this.dropId = undefined;
    }

    private onDrop() {
        const canvas = this.registry.services.module.ui.getCanvas(NodeEditorPanelId);
        const nodeType = this.dropId;
        const nodeObj = this.registry.data.helper.node.createObj(nodeType);
        const nodeView: NodeShape = this.registry.data.helper.node.createView(nodeType, nodeObj);

        this.registry.data.scene.items.add(nodeObj);
        this.registry.data.node.items.add(nodeView);

        nodeView.getBounds().moveTo(canvas.pointer.pointer.curr);
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
} 