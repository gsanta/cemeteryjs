import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { Canvas3dPanel } from "../../models/modules/Canvas3dPanel";
import { AbstractGameObj } from "../../models/objs/AbstractGameObj";
import { UI_Region } from "../../models/UI_Panel";
import { Registry } from "../../Registry";
import { PointerTracker } from "../PointerHandler";
import { AbstractTool, createRectFromMousePointer } from "./AbstractTool";
import { PointerToolLogicForWebGlCanvas } from "./PointerTool";
import { SelectToolId } from "./SelectTool";
import { Cursor } from "./Tool";

export class SelectTool_Webgl extends AbstractTool<AbstractGameObj> {
    private pointerTool: PointerToolLogicForWebGlCanvas;

    constructor(canvas: Canvas3dPanel, registry: Registry) {
        super(SelectToolId, canvas, registry);
        this.pointerTool = new PointerToolLogicForWebGlCanvas(registry, canvas);
    }

    down(pointer: PointerTracker<AbstractGameObj>) {
        this.pointerTool.down(pointer)
    }

    click(pointer: PointerTracker<AbstractGameObj>) {
        this.deselectAll();

        if (pointer.pickedItem) {
            pointer.pickedItem.addTag('select');
        }
    }

    drag(pointer: PointerTracker<AbstractGameObj>) {
        let changed = this.pointerTool.drag(pointer);

        if (!changed) {
            this.rectangleSelection = this.createSelectionRect(pointer);
            // this.selectionLogic.drag(pointer, this.rectangleSelection);
        }

        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    dragEnd(pointer: PointerTracker<AbstractGameObj>) {
        let changed = this.pointerTool.up(pointer);
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

    over(item: AbstractGameObj) {
        item.addTag('hover');
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    out(item: AbstractGameObj) {
        item.removeTag('hover');
        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    private getIntersectingItems(selection: Rectangle): AbstractGameObj[] {
        return [];
    }

    private createSelectionRect(pointer: PointerTracker<AbstractGameObj>): Rectangle {
        return createRectFromMousePointer(pointer);
    }

    private deselectAll() {
        this.canvas.data.items.getAllItems().forEach(item => item.removeTag('select'));
    }
}