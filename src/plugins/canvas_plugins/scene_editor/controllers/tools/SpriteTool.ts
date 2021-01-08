import { View } from "../../../../../core/models/views/View";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { RectangleTool } from "../../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../../core/Registry";
import { ViewStore } from "../../../../../core/stores/ViewStore";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { SpriteViewType } from "../../models/views/SpriteView";

export const SpriteToolId = 'sprite-tool';
export class SpriteTool extends RectangleTool<Canvas2dPanel> {

    constructor(panel: Canvas2dPanel, viewStore: ViewStore, registry: Registry) {
        super(SpriteToolId, panel, viewStore, registry);
    }

    protected createView(rect: Rectangle): View {
        return this.panel.getViewStore().getViewFactory(SpriteViewType).instantiateOnCanvas(this.panel, rect);
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }
}