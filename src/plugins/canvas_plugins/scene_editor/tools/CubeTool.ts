import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../core/Registry";
import { View } from "../../../../core/models/views/View";
import { MeshBoxConfig, MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { MeshView, MeshViewType } from "../views/MeshView";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { ViewStore } from "../../../../core/stores/ViewStore";
import { Canvas2dPanel } from "../../../../core/plugin/Canvas2dPanel";

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
            width: 5,
            height: 5,
            depth: 5
        };

        const cube = this.panel.getViewStore().getViewFactory(MeshViewType).instantiateOnCanvas(this.panel, rect, config);

        return cube;
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }
}