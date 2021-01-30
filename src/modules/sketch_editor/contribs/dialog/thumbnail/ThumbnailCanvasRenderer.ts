import { IRenderer } from "../../../../../core/plugin/IRenderer";
import { Registry } from "../../../../../core/Registry";
import { UI_HtmlCanvas } from "../../../../../core/ui_components/elements/UI_HtmlCanvas";
import { ThumbnailMakerControllerProps } from "./ThumbnailDialogProps";


export class ThumbnailCanvasRenderer implements IRenderer {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    renderInto(canvas: UI_HtmlCanvas): void {
        const toolbar = canvas.toolbar();
        
        let actionIcon = toolbar.actionIcon({key: ThumbnailMakerControllerProps.ThumbnailCreate, uniqueId: `${ThumbnailMakerControllerProps.ThumbnailCreate}`});
        actionIcon.icon = 'insert-photo';
        let tooltip = actionIcon.tooltip();
        tooltip.label = 'Create thumbnail';
    }
}