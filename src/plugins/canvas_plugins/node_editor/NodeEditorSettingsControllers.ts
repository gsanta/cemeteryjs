import { DragAndDropController, ParamControllers } from "../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";
import { NodeView } from "./views/NodeView";

export class NodeEditorSettingsControllers extends ParamControllers {
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
        console.log('ondndend')
        this.dropId = undefined;
    }

    private onDrop() {
        const nodeType = this.dropId;
        const nodeObj = this.registry.data.helper.node.createObj(nodeType);
        const nodeView: NodeView = this.registry.data.helper.node.createView(nodeType, nodeObj);

        this.registry.stores.objStore.addObj(nodeObj);
        this.registry.data.view.node.addView(nodeView);

        nodeView.getBounds().moveTo(this.registry.services.pointer.pointer.curr);
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
} 