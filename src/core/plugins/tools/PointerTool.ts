import { ChildView } from '../../models/views/child_views/ChildView';
import { View, ViewType } from '../../models/views/View';
import { Registry } from '../../Registry';
import { RenderTask } from "../../services/RenderServices";
import { isView, isFeedback } from '../../stores/SceneStore';
import { NodeEditorPlugin, NodeEditorPluginId } from '../../../plugins/ui_plugins/node_editor/NodeEditorPlugin';
import { SceneEditorPlugin, SceneEditorPluginId } from '../../../plugins/ui_plugins/scene_editor/SceneEditorPlugin';
import { AbstractTool } from "./AbstractTool";
import { ToolType } from "./Tool";
import { IPointerEvent } from '../../services/input/PointerService';
import { AbstractCanvasPlugin } from '../AbstractCanvasPlugin';
import { UI_Region } from '../UI_Plugin';
import { JoinPointViewType } from '../../models/views/child_views/JoinPointView';

export class PointerTool extends AbstractTool {
    protected movingItem: View = undefined;
    private isDragStart = true;

    constructor(toolType: ToolType, plugin: AbstractCanvasPlugin, registry: Registry) {
        super(toolType, plugin, registry);
    }

    click(): void {
        const hoveredItem = this.registry.services.pointer.hoveredItem;
        if (!hoveredItem) { return; }

        if (hoveredItem.isChildView()) {
            if (!hoveredItem.parent.isSelected()) {
                this.registry.stores.selectionStore.clear();
                this.registry.stores.selectionStore.addItem(hoveredItem.parent);
                hoveredItem.isActive = true;
            }
            // this.registry.stores.selectionStore.addItem(hoveredItem);

            this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);
        } else if (isView(hoveredItem.viewType)) {
            this.registry.stores.selectionStore.clear();
            this.registry.stores.selectionStore.addItem(hoveredItem);
            this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);
        }
    }

    down() {
        this.initMove() &&  this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    drag(e: IPointerEvent) {
        super.drag(e);

        if (this.movingItem) {
            this.moveItems();
            this.registry.services.render.scheduleRendering(this.plugin.region);
        }
        
        this.isDragStart = false;
    }

    draggedUp() {
        super.draggedUp();

        if (!this.isDragStart) {
            this.registry.services.history.createSnapshot();
            this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
        }

        this.isDragStart = true;
        
        this.updateDraggedView();
        this.movingItem = undefined;
        this.registry.services.level.updateCurrentLevel();
    }

    leave() {
        this.isDragStart = true;
        this.movingItem = undefined;
    }

    over(item: View) {
        if (item.viewType === JoinPointViewType) {
            this.plugin.toolHandler.setPriorityTool(ToolType.Join);
        } else {
            this.registry.services.render.scheduleRendering(this.plugin.region);
        }
    }

    out(item: View) {
        if (item.viewType === JoinPointViewType) {
            this.plugin.toolHandler.removePriorityTool(ToolType.Join);
        } else {
            this.registry.services.render.scheduleRendering(this.plugin.region);
        }
    }

    private initMove(): boolean {
        const hovered = this.registry.services.pointer.hoveredItem;
        if (hovered) {
            this.movingItem = hovered;
            this.moveItems();
            return true;
        }
        return false;
    }

    private moveItems() {
        const views = this.registry.stores.selectionStore.getAllViews();

        if (isFeedback(this.movingItem.viewType)) {
            (<ChildView<any>> this.movingItem).move(this.registry.services.pointer.pointer.getDiff())
        } else if (isView(this.movingItem.viewType)) {
            views.forEach((item, index) => item.move(this.registry.services.pointer.pointer.getDiff()));
        }
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    private updateDraggedView() {
        const view = this.registry.plugins.getHoveredView();

        switch(view.id) {
            case SceneEditorPluginId:
                this.updateSceneViews();
                break;
            case NodeEditorPluginId:
                this.updateNodeEditorViews();
                break;
        }
    }

    private updateSceneViews() {
        let views: View[];

        if (isFeedback(this.movingItem.viewType)) {
            views = [(<ChildView<any>> this.movingItem).parent];
        } else {
            views = this.registry.stores.selectionStore.getAllViews();
        }
    }

    private updateNodeEditorViews() {

    }
}