import { IHotkeyEvent } from "../../../../../core/controller/HotkeyHandler";
import { IKeyboardEvent, Keyboard } from "../../../../../core/controller/KeyboardHandler";
import { PointerTracker } from "../../../../../core/controller/PointerHandler";
import { AbstractTool } from "../../../../../core/controller/tools/AbstractTool";
import { PointerToolLogicForSvgCanvas } from "../../../../../core/controller/tools/PointerTool";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { PathPoinShape, PathPointViewType } from "../../../../../core/models/shapes/child_views/PathPointShape";
import { UI_Region } from "../../../../../core/models/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { PathShape, PathShapeType } from "../../models/shapes/PathShape";

export const PathToolId = 'path-tool';
export class PathTool_Svg extends AbstractTool<AbstractShape> {
    acceptedViews = [PathShapeType, PathPointViewType]
    private pointerTool: PointerToolLogicForSvgCanvas;

    constructor(canvas: Canvas2dPanel, registry: Registry) {
        super(PathToolId, canvas, registry);
        this.pointerTool = new PointerToolLogicForSvgCanvas(registry, canvas);
    }

    click(pointer: PointerTracker<AbstractShape>) {
        const hoveredItem = this.canvas.pointer.pointer.pickedItem;
        if (hoveredItem && this.acceptedViews.indexOf(hoveredItem.viewType) !== -1) {
            this.pointerTool.click(pointer);
        } else {
            this.drawPath(pointer);
        }
    }

    keydown(e: IKeyboardEvent) {
        if (e.keyCode === Keyboard.Enter) {
            this.canvas.data.items.clear();
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
            this.pointerTool.hover(item);
            this.registry.services.render.scheduleRendering(this.canvas.region);
        }
    }

    out(item: AbstractShape) {
        this.pointerTool.unhover(item);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    private drawPath(pointer: PointerTracker<AbstractShape>) {
        const pathes = <PathShape[]> this.canvas.data.selection.getItemsByType(PathShapeType);

        if (pathes.length > 1) { return }

        const path = pathes.length > 0 ? pathes[0] : undefined;
        
        if (path && path.getActiveContainedView()) {
            this.continuePath(path);
        } else {
            this.startNewPath(pointer);
        }

        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
    }

    private continuePath(path: PathShape) {
        const pointer = this.canvas.pointer.pointer;
        const newEditPoint = new PathPoinShape(path, new Point(pointer.down.x, pointer.down.y));
        path.addPathPoint(newEditPoint);
    }

    private startNewPath(pointer: PointerTracker<AbstractShape>) {
        const pathObj = new PathObj(this.registry.services.module.ui.sceneEditor);
        // TODO: remove canvas from AbstractTool, move it to the tools themselves so no casting will be needed
        const pathView: PathShape = new PathShape(pathObj, <Canvas2dPanel> this.canvas);

        const editPoint = new PathPoinShape(pathView, pointer.down.clone());
        pathView.addPathPoint(editPoint);
        this.canvas.data.selection.addItem(pathView);
        return pathView;
    }

    hotkey(hotkeyEvent: IHotkeyEvent) {
        return false;
    }
}