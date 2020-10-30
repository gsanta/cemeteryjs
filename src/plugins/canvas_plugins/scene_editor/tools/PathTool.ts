import { AbstractCanvasPlugin } from "../../../../core/plugin/AbstractCanvasPlugin";
import { Point } from "../../../../utils/geometry/shapes/Point";
import { PathPointView, PathPointViewType } from "../../../../core/models/views/child_views/PathPointView";
import { PathView, PathViewType } from "../../../../core/models/views/PathView";
import { View } from "../../../../core/models/views/View";
import { Registry } from "../../../../core/Registry";
import { IHotkeyEvent } from "../../../../core/services/input/HotkeyService";
import { IKeyboardEvent, Keyboard } from "../../../../core/services/input/KeyboardService";
import { PointerTool } from "../../../../core/plugin/tools/PointerTool";
import { ToolType } from "../../../../core/plugin/tools/Tool";
import { UI_Region } from "../../../../core/plugin/UI_Panel";
import { PathObj, PathObjType } from "../../../../core/models/objs/PathObj";
import { UI_Plugin } from '../../../../core/plugin/UI_Plugin';

export const PathToolId = 'path-tool';
export class PathTool extends PointerTool {
    acceptedViews = [PathViewType, PathPointViewType]

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(PathToolId, plugin, registry);
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
            this.registry.stores.views.clearSelection();
            this.registry.services.render.scheduleRendering(this.plugin.region, UI_Region.Sidepanel);

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
            this.registry.services.render.scheduleRendering(this.plugin.region);
        }
    }

    out(item: View) {
        super.out(item);
        this.registry.services.render.scheduleRendering(this.plugin.region);
    }

    private drawPath() {
        const pathes = <PathView[]> this.registry.stores.views.getSelectedViewsByType(PathViewType);

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
        this.registry.stores.views.clearSelection();

        const pathObj = <PathObj> this.registry.services.objService.createObj(PathObjType);
        const pathView: PathView = <PathView> this.registry.services.viewService.createView(PathViewType);
        pathView.setObj(pathObj);

        const editPoint = new PathPointView(pathView, pointer.down.clone());
        pathView.addPathPoint(editPoint);
        this.registry.stores.views.addView(pathView);
        this.registry.stores.objStore.addObj(pathObj);
        this.registry.stores.views.addSelectedView(pathView);
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