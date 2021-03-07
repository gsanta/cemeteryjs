import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { Canvas3dPanel } from "../../../../../core/models/modules/Canvas3dPanel";
import { AbstractGameObj } from "../../../../../core/models/objs/AbstractGameObj";
import { UI_Region } from "../../../../../core/models/UI_Panel";
import { Registry } from "../../../../../core/Registry";
import { PointerTracker } from "../../../../../core/controller/PointerHandler";
import { AbstractTool, createRectFromMousePointer } from "../../../../../core/controller/tools/AbstractTool";
import { SelectToolId } from "../../../../graph_editor/main/controllers/tools/SelectTool_2D";
import { Cursor } from "../../../../../core/controller/tools/Tool";
import { IObj } from "../../../../../core/models/objs/IObj";
import { GuiRectObj } from "../../../../../core/models/objs/GuiRectObj";
import { Point } from "../../../../../utils/geometry/shapes/Point";

class PointerLogic extends AbstractTool<IObj> {
    pickedItem: AbstractGameObj;    
    
    constructor(registry: Registry, canvas: Canvas3dPanel) {
        super('pointer-tool', canvas, registry);
        this.registry = registry;
        this.canvas = canvas;
    }

    click(pointer: PointerTracker<IObj>): boolean {
        if (pointer.pickedItem) {
            this.pickedItem = <AbstractGameObj> pointer.pickedItem;
            return true;
        }
        return false;    
    }

    up(pointer: PointerTracker<IObj>): boolean {
        if (this.pickedItem) {
            this.pickedItem.addTag('select');
            return true;
        }

        return false;
    }

    hover(item: AbstractGameObj) {
        item.setBoundingBoxVisibility(true);
        return true;
    }

    unhover(item: AbstractGameObj) {
        item.setBoundingBoxVisibility(false);
        return true;
    }

    drag(ponter: PointerTracker<IObj>): boolean {
        return false;
    }
}

export class SelectTool_3D extends AbstractTool<AbstractGameObj> {
    private pointerTool: PointerLogic;
    private guiRectObj: GuiRectObj;

    constructor(canvas: Canvas3dPanel, registry: Registry) {
        super(SelectToolId, canvas, registry);
        this.pointerTool = new PointerLogic(registry, canvas);
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
        // let changed = this.pointerTool.drag(pointer);

        if (!this.guiRectObj) {
            this.guiRectObj = new GuiRectObj(<Canvas3dPanel> this.canvas);
        } else {
            this.guiRectObj.setBounds(this.createSelectionRect(pointer));
        }

        // this.rectangleSelection = this.createSelectionRect(pointer);

        // if (!changed) {
            // this.selectionLogic.drag(pointer, this.rectangleSelection);
        // }

        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    dragEnd(pointer: PointerTracker<AbstractGameObj>) {
        let changed = this.pointerTool.up(pointer);

        if (!changed) {
            const intersectingItems = this.getIntersectingItems();
            
            intersectingItems.forEach(item => item.addTag('select'));
    
            this.rectangleSelection = undefined;
            this.registry.services.render.scheduleRendering(this.canvas.region, UI_Region.Sidepanel);
        }

        if (this.guiRectObj) {
            this.guiRectObj.dispose();
            this.guiRectObj = undefined;
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

    private getIntersectingItems(): AbstractGameObj[] {
        return (this.canvas as Canvas3dPanel).engine.gui.getIntersectingMeshes(this.guiRectObj);
    }

    private createSelectionRect(pointer: PointerTracker<AbstractGameObj>): Rectangle {
        const downX = pointer.downScreen.x;
        const downY = pointer.downScreen.y;
        const currX = pointer.currScreen.x;
        const currY = pointer.currScreen.y;
        const topleftX = downX < currX ? downX : currX; 
        const topleftY = downY < currY ? downY : currY;
        const botRightX = downX >= currX ? downX : currX; 
        const botRightY = downY >= currY ? downY : currY;

        return new Rectangle(new Point(topleftX, topleftY), new Point(botRightX, botRightY));
    }

    private deselectAll() {
        this.canvas.data.items.getAll().forEach(item => item.removeTag('select'));
    }
}