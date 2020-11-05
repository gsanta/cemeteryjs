import { JoinPointViewType } from '../../models/views/child_views/JoinPointView';
import { View, ViewTag } from '../../models/views/View';
import { IPointerEvent } from '../../services/input/PointerService';
import { UI_Region } from '../UI_Panel';
import { NullTool } from "./NullTool";
import { ToolType } from "./Tool";

export abstract class PointerTool extends NullTool {
    acceptedViews: string[] = [];

    protected movingItem: View = undefined;
    private isDragStart = true;

    click(): void {
        const hoveredItem = this.registry.services.pointer.hoveredView;
        if (!hoveredItem) { return; }

        if (hoveredItem.isChildView()) {
            if (!hoveredItem.parent.isSelected()) {
                this.panel.views.clearSelection();
                this.panel.views.addSelectedView(hoveredItem.parent);
            }
            hoveredItem.parent.setActiveChild(hoveredItem);
            this.registry.services.render.scheduleRendering(this.panel.region, UI_Region.Sidepanel);
        } else {
            this.panel.views.clearSelection();
            this.panel.views.addSelectedView(hoveredItem);
            this.registry.services.render.scheduleRendering(this.panel.region, UI_Region.Sidepanel);
        }
    }

    down() {
        this.initMove() &&  this.registry.services.render.scheduleRendering(this.panel.region);
    }

    drag(e: IPointerEvent) {
        super.drag(e);

        if (this.movingItem) {
            this.moveItems();
            this.registry.services.render.scheduleRendering(this.panel.region);
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
            this.panel.getToolController().setPriorityTool(ToolType.Join);
        }
        
        view.tags.add(ViewTag.Hovered);
        view.parent?.tags.add(ViewTag.Hovered);
        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    out(view: View) {
        if (!this.registry.services.pointer.isDown && view.viewType === JoinPointViewType) {
            this.panel.getToolController().removePriorityTool(ToolType.Join);

        } 
        
        view.tags.delete(ViewTag.Hovered);
        view.parent?.tags.delete(ViewTag.Hovered);
        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    private initMove(): boolean {
        const hovered = this.registry.services.pointer.hoveredView;
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
            const views = this.panel.views.getSelectedViews();
            views.forEach(item => item.move(this.registry.services.pointer.pointer.getDiff()));
        }
        this.registry.services.render.scheduleRendering(this.panel.region);
    }
}