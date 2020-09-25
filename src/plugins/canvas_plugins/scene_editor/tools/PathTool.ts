import { AbstractCanvasPlugin } from "../../../../core/plugin/AbstractCanvasPlugin";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { PathPointView, PathPointViewType } from "../../../../core/models/views/child_views/PathPointView";
import { PathView } from "../../../../core/models/views/PathView";
import { ViewType, View } from "../../../../core/models/views/View";
import { Registry } from "../../../../core/Registry";
import { IHotkeyEvent } from "../../../../core/services/input/HotkeyService";
import { IKeyboardEvent, Keyboard } from "../../../../core/services/input/KeyboardService";
import { PointerTool } from "../../../../core/plugin/tools/PointerTool";
import { ToolType } from "../../../../core/plugin/tools/Tool";
import { UI_Region } from "../../../../core/plugin/UI_Plugin";

export class PathTool extends PointerTool {
    acceptedViews = [ViewType.PathView, PathPointViewType]

    constructor(plugin: AbstractCanvasPlugin, registry: Registry) {
        super(ToolType.Path, plugin, registry);
    }

    click() {
        const hoveredItem = this.registry.services.pointer.hoveredItem;
        if (hoveredItem && this.acceptedViews.indexOf(hoveredItem.viewType) !== -1) {
            super.click();
        } else {
            this.drawPath();
        }
    }

    keydown(e: IKeyboardEvent) {
        if (e.keyCode === Keyboard.Enter) {
            this.registry.stores.viewStore.clearSelection();
            this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);

            this.registry.services.history.createSnapshot();
        }
    }

    over(item: View) {
        let hover = false;
        if (item.viewType === ViewType.PathView) {
            hover = true;
        }

        if (item.viewType === PathPointViewType) {
            if (item.parent.viewType === ViewType.PathView) {
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

    private drawPath() {
        const pathes = <PathView[]> this.registry.stores.viewStore.getSelectedViewsByType(ViewType.PathView);

        if (pathes.length > 1) { return }

        const path = pathes.length > 0 ? pathes[0] : undefined;
        
        if (path && path.getActiveChild()) {
            this.continuePath(path);
        } else {
            this.startNewPath();
        }

        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);
    }

    private continuePath(path: PathView) {
        const pointer = this.registry.services.pointer.pointer;
        const newEditPoint = new PathPointView(path, new Point(pointer.down.x, pointer.down.y));
        path.addPathPoint(newEditPoint);
    }

    private startNewPath() {
        const pointer = this.registry.services.pointer.pointer;
        this.registry.stores.viewStore.clearSelection();

        const path = new PathView();
        const editPoint = new PathPointView(path, pointer.down.clone());
        path.addPathPoint(editPoint);
        this.registry.stores.viewStore.addView(path);
        this.registry.stores.viewStore.addSelectedView(path);
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