import { BasicShapeType, MeshBoxConfig } from "../../../../core/models/objs/MeshObj";
import { View } from "../../../../core/models/views/View";
import { Canvas2dPanel } from "../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../core/Registry";
import { sceneAndGameViewRatio, ViewStore } from "../../../../core/stores/ViewStore";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { MeshViewType } from "../views/MeshView";

export const GroundToolId = 'ground-tool';
export class GroundTool extends RectangleTool<Canvas2dPanel> {
    icon = 'grid';
    displayName = 'Ground';

    constructor(panel: Canvas2dPanel, viewStore: ViewStore, registry: Registry) {
        super(GroundToolId, panel, viewStore, registry);
    }

    protected createView(rect: Rectangle): View {
        const config = <MeshBoxConfig> {
            shapeType: BasicShapeType.Ground,
            width: rect.getWidth() / sceneAndGameViewRatio,
            height: rect.getHeight() / sceneAndGameViewRatio
        };

        const ground = this.panel.getViewStore().getViewFactory(MeshViewType).instantiateOnCanvas(this.panel, rect, config);

        return ground;
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }
}