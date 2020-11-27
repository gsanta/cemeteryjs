import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { Registry } from '../../Registry';
import { IPointerEvent } from '../../services/input/PointerService';
import { ToolAdapter, createRectFromMousePointer } from './ToolAdapter';
import { UI_Region } from '../UI_Panel';
import { View } from '../../models/views/View';
import { AbstractCanvasPanel } from '../AbstractCanvasPanel';
import { ViewStore } from '../../stores/ViewStore';

export abstract class RectangleTool<P extends AbstractCanvasPanel> extends ToolAdapter<P> {
    protected rectangleFeedback: Rectangle;
    protected tmpView: View;
    protected viewStore: ViewStore;
    protected rectRadius = 50;

    constructor(type: string, panel: P, store: ViewStore, registry: Registry) {
        super(type, panel, registry);
        this.viewStore = store;
    }

    click() {
        const pointer = this.registry.services.pointer.pointer;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, this.rectRadius);

        const view = this.createView(rect);

        this.viewStore.clearSelection()
        this.viewStore.addSelectedView(view);

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }

    drag(e: IPointerEvent) {
        super.drag(e)

        this.tmpView && this.removeTmpView();

        this.rectangleFeedback = createRectFromMousePointer(this.registry.services.pointer.pointer);

        this.tmpView = this.createView(this.rectangleFeedback);

        this.registry.services.render.scheduleRendering(this.panel.region);
    }

    draggedUp() {
        super.draggedUp();

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.history.createSnapshot();

        this.rectangleFeedback = undefined;
        if (this.tmpView) {
            this.tmpView = null;
        }
    }

    leave() {
        this.rectangleFeedback = undefined;
        return true;
    }

    protected abstract createView(rect: Rectangle): View;
    protected abstract removeTmpView();
}