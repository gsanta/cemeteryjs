import { AbstractCanvasPlugin } from "../AbstractCanvasPlugin";
import { Point } from "../../../utils/geometry/shapes/Point";
import { FeedbackType } from "../../stores/views/child_views/ChildView";
import { EditPointView } from "../../stores/views/child_views/EditPointView";
import { PathView } from "../../stores/views/PathView";
import { ViewType, View } from "../../stores/views/View";
import { Registry } from "../../Registry";
import { IHotkeyEvent } from "../../services/input/HotkeyService";
import { IKeyboardEvent, Keyboard } from "../../services/input/KeyboardService";
import { RenderTask } from "../../services/RenderServices";
import { PointerTool } from "./PointerTool";
import { ToolType } from "./Tool";
import { UI_Region } from "../UI_Plugin";

export class PathTool extends PointerTool {

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(ToolType.Path, plugin, registry);
    }

    click() {
        const hoveredItem = this.registry.services.pointer.hoveredItem;
        if (hoveredItem && (hoveredItem.viewType === ViewType.PathView || hoveredItem.viewType === FeedbackType.EditPointFeedback)) {
            super.click();
        } else {
            this.createPath();
        }
    }

    keydown(e: IKeyboardEvent) {
        if (e.keyCode === Keyboard.Enter) {
            this.registry.stores.selectionStore.clear();
            this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);

            this.registry.services.history.createSnapshot();
        }
    }

    over(item: View) {
        let hover = false;
        if (item.viewType === ViewType.PathView) {
            hover = true;
        }

        if (item.viewType === FeedbackType.EditPointFeedback) {
            if ((<EditPointView> item).parent.viewType === ViewType.PathView) {
                hover = true;
            }
        }

        if (hover) {
            super.over(item);
            this.registry.services.render.scheduleRendering(this.plugin.region);
        }
    }

    out(item: View) {
        super.out(item);
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    private createPath() {
        const pathes = this.registry.stores.selectionStore.getPathViews();

        if (pathes.length > 1) { return }

        const path = pathes.length > 0 ? pathes[0] : undefined;
        const editPoint = this.registry.stores.selectionStore.getEditPoint();

        if (path && editPoint) {
            const pointer = this.registry.services.pointer.pointer;
            const selectedEditPoint = this.registry.stores.selectionStore.getEditPoint();
            const newEditPoint = new EditPointView({point: new Point(pointer.down.x, pointer.down.y), parent: path});
            newEditPoint.id = this.getStore().generateUniqueName(FeedbackType.EditPointFeedback); 
            path.addEditPoint(newEditPoint, selectedEditPoint);
            this.registry.stores.selectionStore.removeItem(selectedEditPoint);
            this.registry.stores.selectionStore.addItem(newEditPoint);
        } else {
            this.startNewPath();
        }

        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);
    }

    private startNewPath() {
        const pointer = this.registry.services.pointer.pointer;
        this.registry.stores.selectionStore.clear();

        const path = new PathView();
        const editPoint = new EditPointView({point: pointer.down.clone(), parent: path});
        editPoint.id = this.registry.stores.canvasStore.generateUniqueName(FeedbackType.EditPointFeedback); 
        path.addEditPoint(editPoint)
        path.id = this.registry.stores.canvasStore.generateUniqueName(ViewType.PathView);
        this.registry.stores.canvasStore.addView(path);
        this.registry.services.game.addConcept(path);
        this.registry.stores.selectionStore.addItem(path);
        this.registry.stores.selectionStore.addItem(path.editPoints[0]);
    }

    hotkey(hotkeyEvent: IHotkeyEvent) {
        return false;
        // if (event.isHover && isNodeConnectionControl(this.registry.services.pointer.hoveredItem)) {
        //     this.registry.services.layout.getHoveredView().setPriorityTool(this);
        //     return true;
        // }
        // return false;
    }
}