import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../Registry";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";
import { ObjJson, AfterAllObjsDeserialized, IObj } from "./IObj";

export class GuiRectObj implements IObj {
    id: string;
    name: string;
    objType: string;
    canvas: Canvas3dPanel;
    
    private bounds: Rectangle;

    constructor(canvas: Canvas3dPanel) {
        this.canvas = canvas;
        this.canvas.engine.gui.createRectangle(this);
    }

    setBounds(bounds: Rectangle) {
        this.bounds = bounds;

        const rectWidth = bounds.bottomRight.x - bounds.topLeft.x;
        const rectHeight = bounds.bottomRight.y - bounds.topLeft.y;
        const canvasWidth = this.canvas.htmlElement.getBoundingClientRect().width;
        const canvasHeight = this.canvas.htmlElement.getBoundingClientRect().height;
        const canvasCenterX = canvasWidth / 2;
        const canvasCenterY = canvasHeight / 2;
        const rectWidthHalf = rectWidth / 2;
        const rectHeightHalf = rectHeight / 2;
        const left = canvasCenterX - bounds.topLeft.x - rectWidthHalf;
        const top = canvasCenterY - bounds.topLeft.y - rectHeightHalf;
        const right = -left + rectWidth;
        const bottom = -top + rectHeight;
        
        const guiRect = new Rectangle(new Point(-left, -top), new Point(right, bottom));

        this.canvas.engine.gui.updateRectangle(this, {bounds: guiRect});
    }

    getBounds(): Rectangle {
        return this.bounds;
    }

    dispose(): void {
        this.canvas.engine.gui.deleteItem(this);
        // throw new Error("Method not implemented.");
    }

    serialize(): ObjJson {
        throw new Error("Method not implemented.");
    }

    deserialize(json: ObjJson, registry: Registry): AfterAllObjsDeserialized {
        throw new Error("Method not implemented.");
    }

    clone(registry: Registry): IObj {
        throw new Error("Method not implemented.");
    }

}