import { NodePortViewType } from '../../models/views/child_views/NodePortView';
import { View, ViewTag } from '../../models/views/View';
import { Registry } from '../../Registry';
import { IPointerEvent } from '../../services/input/PointerService';
import { ViewStore } from '../../stores/ViewStore';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { UI_Region } from '../UI_Panel';
import { ToolAdapter } from "./ToolAdapter";
import { ToolType } from "./Tool";

export abstract class PointerTool<P extends AbstractCanvasPanel = AbstractCanvasPanel> extends ToolAdapter<P> {
    acceptedViews: string[] = [];

    protected movingItem: View = undefined;
    private isDragStart = true;
    protected viewStore: ViewStore;

    constructor(type: string, panel: P, store: ViewStore, registry: Registry) {
        super(type, panel, registry);
        this.viewStore = store;
    }

    click(): void {
        const hoveredItem = this.registry.services.pointer.hoveredView;
        if (!hoveredItem) { return; }

        if (hoveredItem.isContainedView()) {
            if (!hoveredItem.containerView.isSelected()) {
                this.viewStore.clearSelection();
                this.viewStore.addSelectedView(hoveredItem.containerView);
            }
            hoveredItem.containerView.setActiveContainedView(hoveredItem);
            this.registry.services.render.scheduleRendering(this.panel.region, UI_Region.Sidepanel);
        } else {
            this.viewStore.clearSelection();
            this.viewStore.addSelectedView(hoveredItem);
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
        if (view.viewType === NodePortViewType) {
            this.panel.toolController.setPriorityTool(ToolType.Join);
        }
        
        view.tags.add(ViewTag.Hovered);
        view.containerView?.tags.add(ViewTag.Hovered);
        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    out(view: View) {
        if (!this.registry.services.pointer.isDown && view.viewType === NodePortViewType) {
            this.panel.toolController.removePriorityTool(ToolType.Join);

        } 
        
        view.tags.delete(ViewTag.Hovered);
        view.containerView?.tags.delete(ViewTag.Hovered);
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
        if (this.movingItem.isContainedView()) {
            this.movingItem.move(this.registry.services.pointer.pointer.getDiff())
        } else {
            const views = this.viewStore.getSelectedViews();
            views.filter(view => !views.includes(view.getParent())).forEach(item => item.move(this.registry.services.pointer.pointer.getDiff()));
        }
        this.registry.services.render.scheduleRendering(this.panel.region);
    }
}