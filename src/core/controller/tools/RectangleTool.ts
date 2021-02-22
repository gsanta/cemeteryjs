import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { PointerTracker } from '../PointerHandler';
import { Registry } from '../../Registry';
import { AbstractCanvasPanel } from '../../models/modules/AbstractCanvasPanel';
import { UI_Region } from '../../models/UI_Panel';
import { createRectFromMousePointer, AbstractTool } from './AbstractTool';
import { AbstractShape } from "../../models/shapes/AbstractShape";

export abstract class RectangleTool extends AbstractTool<AbstractShape> {
    protected rectangleFeedback: Rectangle;
    protected tmpView: AbstractShape;
    protected rectRadius = 50;

    constructor(type: string, panel: AbstractCanvasPanel<AbstractShape>, registry: Registry) {
        super(type, panel, registry);
    }

    click() {
        const pointer = this.canvas.pointer.pointer;
        const rect = Rectangle.squareFromCenterPointAndRadius(pointer.down, this.rectRadius);

        const view = this.createView(rect);

        this.canvas.data.items.clearTag('select');
        view.addTag('select');

        this.registry.services.level.updateCurrentLevel();
        this.registry.services.history.createSnapshot();
        this.registry.services.render.scheduleRendering(UI_Region.Canvas1, UI_Region.Canvas2, UI_Region.Sidepanel);
    }

    drag(pointer: PointerTracker<AbstractShape>) {
        super.drag(pointer)

        this.tmpView && this.removeTmpView();

        this.rectangleFeedback = createRectFromMousePointer(this.canvas.pointer.pointer);

        this.tmpView = this.createView(this.rectangleFeedback);

        this.registry.services.render.scheduleRendering(this.canvas.region);
    }

    dragEnd(pointer: PointerTracker<AbstractShape>) {
        super.dragEnd(pointer);

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

    protected abstract createView(rect: Rectangle): AbstractShape;
    protected abstract removeTmpView();
}