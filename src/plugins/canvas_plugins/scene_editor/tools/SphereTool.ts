import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../core/Registry";
import { View } from "../../../../core/models/views/View";
import { MeshObj, MeshObjType, MeshSphereConfig } from "../../../../core/models/objs/MeshObj";
import { MeshView, MeshViewType } from "../views/MeshView";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { ViewStore } from "../../../../core/stores/ViewStore";
import { Canvas2dPanel } from "../../../../core/plugin/Canvas2dPanel";

export const SphereToolId = 'sphere-tool';
export class SphereTool extends RectangleTool<Canvas2dPanel> {
    icon = 'sphere';
    displayName = 'Sphere';

    constructor(panel: Canvas2dPanel, viewStore: ViewStore, registry: Registry) {
        super(SphereToolId, panel, viewStore, registry);
    }

    protected createView(rect: Rectangle): View {
        const sphere = this.panel.getViewStore().getViewFactory(MeshViewType).instantiateOnCanvas(this.panel, rect);

        (sphere.getObj() as MeshObj).shapeConfig = <MeshSphereConfig> {
            shapeType: 'Sphere',
            diameter: 5,
        }
     
        return sphere;
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }
}