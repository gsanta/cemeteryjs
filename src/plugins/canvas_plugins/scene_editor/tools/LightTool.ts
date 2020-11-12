import { MeshObj, MeshObjType } from "../../../../core/models/objs/MeshObj";
import { MeshView, MeshViewType } from "../../../../core/models/views/MeshView";
import { View } from "../../../../core/models/views/View";
import { RectangleTool } from "../../../../core/plugin/tools/RectangleTool";
import { Registry } from "../../../../core/Registry";
import { Rectangle } from "../../../../utils/geometry/shapes/Rectangle";
import { colors } from "../../../../core/ui_components/react/styles";
import { AbstractCanvasPanel } from "../../../../core/plugin/AbstractCanvasPanel";
import { ViewStore } from "../../../../core/stores/ViewStore";
import { LightView, LightViewType } from "../../../../core/models/views/LightView";

export const LightToolId = 'light-tool';

export class LightTool extends RectangleTool {
    constructor(panel: AbstractCanvasPanel, viewStore: ViewStore, registry: Registry) {
        super(LightToolId, panel, viewStore, registry);
        this.rectRadius = 15;
    }

    protected createView(rect: Rectangle): View {
        const lightView: LightView = <LightView> this.registry.data.view.scene.createView(LightViewType);
        lightView.setBounds(rect);

        this.viewStore.addView(lightView);

        return lightView;
    }
    
    protected removeTmpView() {
        this.viewStore.removeView(this.tmpView);
    }
}