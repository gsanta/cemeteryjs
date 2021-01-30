import { Point } from "../../../../../utils/geometry/shapes/Point";
import { PathPoinShape, PathPointViewType } from "../../../../../core/models/shapes/child_views/PathPointShape";
import { PathShape, PathShapeType } from "../../models/shapes/PathShape";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { Registry } from "../../../../../core/Registry";
import { IHotkeyEvent } from "../../../../../core/controller/HotkeyHandler";
import { IKeyboardEvent, Keyboard } from "../../../../../core/controller/KeyboardHandler";
import { PointerTool } from "../../../../../core/plugin/tools/PointerTool";
import { UI_Region } from "../../../../../core/plugin/UI_Panel";
import { ShapeStore } from "../../../../../core/stores/ShapeStore";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { SketchEditorModule } from "../../SketchEditorModule";

export const PathToolId = 'path-tool';
export class PathTool extends PointerTool {
    acceptedViews = [PathShapeType, PathPointViewType]

    constructor(panel: Canvas2dPanel<AbstractShape>, viewStore: ShapeStore, registry: Registry) {
        super(PathToolId, panel, viewStore, registry);
    }

    click() {
        const hoveredItem = this.canvas.pointer.hoveredView;
        if (hoveredItem && this.acceptedViews.indexOf(hoveredItem.viewType) !== -1) {
            super.click();
        } else {
            this.drawPath();
        }
    }

    keydown(e: IKeyboardEvent) {
        if (e.keyCode === Keyboard.Enter) {
            this.viewStore.clearSelection();
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);

            this.registry.services.history.createSnapshot();
        }
    }

    over(item: AbstractShape) {
        let hover = false;
        if (item.viewType === PathShapeType) {
            hover = true;
        }

        if (item.viewType === PathPointViewType) {
            if (item.containerShape.viewType === PathShapeType) {
                hover = true;
            }
        }

        if (hover) {
            super.over(item);
            this.registry.services.render.scheduleRendering(this.canvas.region);
        }
    }

    out(item: AbstractShape) {
        super.out(item);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    private drawPath() {
        const pathes = <PathShape[]> this.viewStore.getSelectedShapesByType(PathShapeType);

        if (pathes.length > 1) { return }

        const path = pathes.length > 0 ? pathes[0] : undefined;
        
        if (path && path.getActiveContainedView()) {
            this.continuePath(path);
        } else {
            this.startNewPath();
        }

        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
    }

    private continuePath(path: PathShape) {
        const pointer = this.canvas.pointer.pointer;
        const newEditPoint = new PathPoinShape(path, new Point(pointer.down.x, pointer.down.y));
        path.addPathPoint(newEditPoint);
    }

    private startNewPath() {
        const canvas = <SketchEditorModule> this.canvas;
        
        return canvas.getViewStore().getViewFactory(PathShapeType).instantiateOnCanvas(canvas, undefined);
    }

    hotkey(hotkeyEvent: IHotkeyEvent) {
        return false;
    }
}