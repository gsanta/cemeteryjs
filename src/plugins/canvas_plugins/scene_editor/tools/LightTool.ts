import { MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { MeshView, MeshViewType } from "../views/MeshView";
import { View } from "../../../../core/models/views/View";
import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../core/Registry";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { colors } from "../../../../core/ui_components/react/styles";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { ViewStore } from "../../../../core/stores/ViewStore";
import { LightView, LightViewType } from "../views/LightView";
import { LightObj, LightObjType } from "../../../../core/models/objs/LightObj";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { Canvas2dPanel } from "../../../../core/plugin/Canvas2dPanel";

export const LightToolId = 'light-tool';

export class LightTool extends RectangleTool<Canvas2dPanel> {
    constructor(panel: Canvas2dPanel, viewStore: ViewStore, registry: Registry) {
        super(LightToolId, panel, viewStore, registry);
        this.rectRadius = 15;
    }

    protected createView(rect: Rectangle): View {
        return this.panel.getViewStore().getViewFactory(LightViewType).instantiateOnCanvas(this.panel, rect);
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }
}