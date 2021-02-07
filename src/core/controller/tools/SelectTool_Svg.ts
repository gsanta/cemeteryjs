import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { getIntersectingViews } from "../../data/stores/ShapeStore";
import { Canvas2dPanel } from "../../models/modules/Canvas2dPanel";
import { AbstractShape } from "../../models/shapes/AbstractShape";
import { UI_Region } from "../../models/UI_Panel";
import { Registry } from "../../Registry";
import { PointerTracker } from "../PointerHandler";
import { AbstractTool, createRectFromMousePointer } from "./AbstractTool";
import { PointerToolLogicForSvgCanvas } from "./PointerTool";
import { SelectToolId } from "./SelectTool";
import { Cursor } from "./Tool";

export class SelectTool_Svg extends AbstractTool<AbstractShape> {
    private pointerTool: PointerToolLogicForSvgCanvas;

    constructor(canvas: Canvas2dPanel, registry: Registry) {
        super(SelectToolId, canvas, registry);
        this.pointerTool = new PointerToolLogicForSvgCanvas(registry, canvas);
    }

    down(pointer: PointerTracker<AbstractShape>) {
        this.pointerTool.down(pointer)
    }

    click(pointer: PointerTracker<AbstractShape>) {
        if (!this.pointerTool.click(pointer)) {
            this.canvas.data.selection.clear();
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }
    }

    drag(pointer: PointerTracker<AbstractShape>) {
        let changed = this.pointerTool.drag();

        if (!changed) {
            this.rectangleSelection = this.createSelectionRect(pointer);
            // this.selectionLogic.drag(pointer, this.rectangleSelection);
        }

        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    dragEnd(pointer: PointerTracker<AbstractShape>) {
        let changed = this.pointerTool.up();
        // this.selectionLogic.up();

        if (!changed) {
            if (!this.rectangleSelection) { return }
    
            const intersectingShapes = this.getIntersectingItems(this.rectangleSelection);
            
            this.canvas.data.selection.clear();
            intersectingShapes.forEach(shape => this.canvas.data.selection.addItem(shape));
    
            this.rectangleSelection = undefined;
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }
    }

    getCursor() {
        if (this.canvas.pointer.pointer.pickedItem) {
            return Cursor.Pointer;
        }

        return Cursor.Default;
    }

    over(item) {
        this.pointerTool.hover(item);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }
    out(item) {
        this.pointerTool.unhover(item);
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    private getIntersectingItems(selection: Rectangle): AbstractShape[] {
        return getIntersectingViews(this.canvas.data.items, selection);
    }

    private createSelectionRect(pointer: PointerTracker<AbstractShape>): Rectangle {
        return createRectFromMousePointer(pointer);
    }
}