import { MeshBoxConfig, MeshObj, MeshSphereConfig } from "../../../../../core/models/objs/MeshObj";
import { View } from "../../../../../core/models/views/View";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { sceneAndGameViewRatio, ViewStore } from "../../../../../core/stores/ViewStore";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MeshViewType } from "../../models/views/MeshView";

export const SphereToolId = 'sphere-tool';
export class SphereTool extends RectangleTool<Canvas2dPanel> {
    icon = 'sphere';
    displayName = 'Sphere';

    constructor(panel: Canvas2dPanel, viewStore: ViewStore, registry: Registry) {
        super(SphereToolId, panel, viewStore, registry);
    }

    protected createView(rect: Rectangle): View {
        const config = <MeshSphereConfig> {
            shapeType: 'Sphere',
            diameter: 5
        };

        const sphere = this.panel.getViewStore().getViewFactory(MeshViewType).instantiateOnCanvas(this.panel, rect, config);


        return sphere;
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }
}