import { MeshView } from "../../../core/models/views/MeshView";
import { IRenderer } from "../../../core/plugin/IRenderer";
import { Registry } from "../../../core/Registry";
import { UI_HtmlCanvas } from "../../../core/ui_components/elements/UI_HtmlCanvas";
import { UI_Row } from "../../../core/ui_components/elements/UI_Row";
import { ThumbnailMakerControllerProps } from "./ThumbnailDialogProps";


export class ThumbnailCanvasRenderer implements IRenderer {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    renderInto(canvas: UI_HtmlCanvas): void {
        const meshView = this.registry.stores.views.getOneSelectedView() as MeshView;

        const toolbar = canvas.toolbar();
        
        let actionIcon = toolbar.actionIcon({key: ThumbnailMakerControllerProps.ThumbnailCreate, uniqueId: `${this.id}-${ThumbnailMakerControllerProps.ThumbnailCreate}`});
        actionIcon.icon = 'insert-photo';
        let tooltip = actionIcon.tooltip();
        tooltip.label = 'Create thumbnail';
    }
}