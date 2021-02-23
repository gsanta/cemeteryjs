import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { Registry } from "../../Registry";
import { Canvas3dPanel } from "../modules/Canvas3dPanel";
import { ObjJson, AfterAllObjsDeserialized, IObj } from "./IObj";

export class GuiRectObj implements IObj {
    id: string;
    name: string;
    objType: string;
    canvas: Canvas3dPanel;

    constructor(canvas: Canvas3dPanel) {
        this.canvas = canvas;
        this.canvas.engine.gui.createRectangle(this);
    }

    setBounds(bounds: Rectangle) {
        this.canvas.engine.gui.updateRectangle(this, {bounds});
    }

    dispose(): void {
        throw new Error("Method not implemented.");
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