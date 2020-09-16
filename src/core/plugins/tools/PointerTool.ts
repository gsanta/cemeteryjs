import { JoinPointViewType } from '../../models/views/child_views/JoinPointView';
import { View, ViewTag } from '../../models/views/View';
import { Registry } from '../../Registry';
import { IPointerEvent } from '../../services/input/PointerService';
import { AbstractCanvasPlugin } from '../AbstractCanvasPlugin';
import { UI_Region } from '../UI_Plugin';
import { AbstractTool } from "./AbstractTool";
import { ToolType } from "./Tool";

export abstract class PointerTool extends AbstractTool {
    acceptedViews: string[] = [];

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
                this.registry.stores.selectionStore.clearSelection();
                this.registry.stores.selectionStore.addSelectedView(hoveredItem.parent);
            }
            hoveredItem.parent.setActiveChild(hoveredItem);
            this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);
        } else {
            this.registry.stores.selectionStore.clearSelection();
            this.registry.stores.selectionStore.addSelectedView(hoveredItem);
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
        
        this.movingItem = undefined;
        this.registry.services.level.updateCurrentLevel();
    }

    leave() {
        this.isDragStart = true;
        this.movingItem = undefined;
    }

    over(view: View) {
        if (view.viewType === JoinPointViewType) {
            this.plugin.toolHandler.setPriorityTool(ToolType.Join);
        }
        
        view.tags.add(ViewTag.Hovered);
        view.parent?.tags.add(ViewTag.Hovered);
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    out(view: View) {
        if (view.viewType === JoinPointViewType) {
            this.plugin.toolHandler.removePriorityTool(ToolType.Join);
        } 
        
        view.tags.delete(ViewTag.Hovered);
        view.parent?.tags.delete(ViewTag.Hovered);
        this.registry.services.render.scheduleRendering(this.plugin.region);
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
        if (this.movingItem.isChildView()) {
            this.movingItem.move(this.registry.services.pointer.pointer.getDiff())
        } else {
            const views = this.registry.stores.selectionStore.getSelectedViews();
            views.forEach(item => item.move(this.registry.services.pointer.pointer.getDiff()));
        }
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }
}