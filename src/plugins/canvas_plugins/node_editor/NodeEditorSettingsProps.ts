import { NodeView } from "../../../core/models/views/NodeView";
import { DragAndDropController, ParamControllers, PropController } from "../../../core/plugin/controller/FormController";
import { UI_Region } from "../../../core/plugin/UI_Panel";
import { Registry } from "../../../core/Registry";

export class NodeEditorSettingsControllers extends ParamControllers {
    constructor(registry: Registry) {
        super();
        this.dragNode = new DragNodeController(registry);
    }

    dragNode: DragNodeController;
}

export class DragNodeController extends DragAndDropController {
    constructor(registry: Registry) {
        super(registry);
    }

    onDndStart() {
        this.registry.services.render.reRender(UI_Region.Sidepanel, UI_Region.Canvas1);
        this.registry.services.render.reRenderAll();
    }

    onDndEnd(dropId: string) {
        const nodeObj = this.registry.data.helper.node.createObj(dropId);
        const nodeView: NodeView = this.registry.data.helper.node.createView(dropId, nodeObj);

        this.registry.stores.objStore.addObj(nodeObj);
        this.registry.data.view.node.addView(nodeView);

        nodeView.getBounds().moveTo(this.registry.services.pointer.pointer.curr);
        this.registry.services.history.createSnapshot();
        this.registry.services.render.reRender(UI_Region.Canvas1);
    }
} 