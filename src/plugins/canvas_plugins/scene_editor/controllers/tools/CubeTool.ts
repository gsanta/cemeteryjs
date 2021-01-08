import { MeshBoxConfig } from "../../../../../core/models/objs/MeshObj";
import { View } from "../../../../../core/models/views/View";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { sceneAndGameViewRatio, ViewStore } from "../../../../../core/stores/ViewStore";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { MeshViewType } from "../../models/views/MeshView";

export const CubeToolId = 'cube-tool';
export class CubeTool extends RectangleTool<Canvas2dPanel> {
    icon = 'cube';
    displayName = 'Cube';

    constructor(panel: Canvas2dPanel, viewStore: ViewStore, registry: Registry) {
        super(CubeToolId, panel, viewStore, registry);
    }

    protected createView(rect: Rectangle): View {

        const config = <MeshBoxConfig> {
            shapeType: 'Box',
            width: rect.getWidth() / sceneAndGameViewRatio,
            height: 5,
            depth: rect.getHeight() / sceneAndGameViewRatio
        };

        const cube = this.panel.getViewStore().getViewFactory(MeshViewType).instantiateOnCanvas(this.panel, rect, config);

        return cube;
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }
}