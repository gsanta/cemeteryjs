import { MeshObj, MeshObjType } from "../../../../../core/models/objs/MeshObj";
import { MeshShape, MeshShapeType } from "../../models/shapes/MeshShape";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { RectangleTool } from "../../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { colors } from "../../../../../core/ui_components/react/styles";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { ShapeStore } from "../../../../../core/stores/ShapeStore";
import { LightShape, LightShapeType } from "../../models/shapes/LightShape";
import { LightObj, LightObjType } from "../../../../../core/models/objs/LightObj";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";

export const LightToolId = 'light-tool';

export class LightTool extends RectangleTool<Canvas2dPanel> {
    constructor(panel: Canvas2dPanel, viewStore: ShapeStore, registry: Registry) {
        super(LightToolId, panel, viewStore, registry);
        this.rectRadius = 15;
    }

    protected createView(rect: Rectangle): AbstractShape {
        return this.canvas.getViewStore().getViewFactory(LightShapeType).instantiateOnCanvas(this.canvas, rect);
    }
    
    protected removeTmpView() {
        this.viewStore.removeShape(this.tmpView);
    }
}