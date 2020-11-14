import { Point } from "../../../../utils/geometry/shapes/Point";
import { PathPointView, PathPointViewType } from "../../../../core/models/views/child_views/PathPointView";
import { PathView, PathViewType } from "../../../../core/models/views/PathView";
import { View } from "../../../../core/models/views/View";
import { Registry } from "../../../../core/Registry";
import { IHotkeyEvent } from "../../../../core/services/input/HotkeyService";
import { IKeyboardEvent, Keyboard } from "../../../../core/services/input/KeyboardService";
import { PointerTool } from "../../../../core/plugin/tools/PointerTool";
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { ViewStore } from "../../../../core/stores/ViewStore";
import { Canvas2dPanel } from "../../../../core/plugin/Canvas2dPanel";

export const PathToolId = 'path-tool';
export class PathTool extends PointerTool<Canvas2dPanel> {
    acceptedViews = [PathViewType, PathPointViewType]

    constructor(panel: Canvas2dPanel, viewStore: ViewStore, registry: Registry) {
        super(PathToolId, panel, viewStore, registry);
    }

    click() {
        const hoveredItem = this.registry.services.pointer.hoveredView;
        if (hoveredItem && this.acceptedViews.indexOf(hoveredItem.viewType) !== -1) {
            super.click();
        } else {
            this.drawPath();
        }
    }

    keydown(e: IKeyboardEvent) {
        if (e.keyCode === Keyboard.Enter) {
            this.viewStore.clearSelection();
            this.registry.services.render.scheduleRendering(this.panel.region, UI_Region.Sidepanel);

            this.registry.services.history.createSnapshot();
        }
    }

    over(item: View) {
        let hover = false;
        if (item.viewType === PathViewType) {
            hover = true;
        }

        if (item.viewType === PathPointViewType) {
            if (item.parent.viewType === PathViewType) {
                hover = true;
            }
        }

        if (hover) {
            super.over(item);
            this.registry.services.render.scheduleRendering(this.panel.region);
        }
    }

    out(item: View) {
        super.out(item);
        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    private drawPath() {
        const pathes = <PathView[]> this.viewStore.getSelectedViewsByType(PathViewType);

        if (pathes.length > 1) { return }

        const path = pathes.length > 0 ? pathes[0] : undefined;
        
        if (path && path.getActiveChild()) {
            this.continuePath(path);
        } else {
            this.startNewPath();
        }

        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(this.panel.region, UI_Region.Sidepanel);
    }

    private continuePath(path: PathView) {
        const pointer = this.registry.services.pointer.pointer;
        const newEditPoint = new PathPointView(path, new Point(pointer.down.x, pointer.down.y));
        path.addPathPoint(newEditPoint);
    }

    private startNewPath() {
        return this.panel.getViewStore().getViewFactory(PathViewType).instantiateOnCanvas(this.panel, undefined);
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