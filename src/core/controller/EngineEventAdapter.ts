import { AbstractCanvasPanel } from "../plugin/AbstractCanvasPanel";
import { Registry } from "../Registry";
import { IPointerEvent, IPointerEventType } from "./PointerHandler";


export class EngineEventAdapter<D> {
    private registry: Registry;
    private canvas: AbstractCanvasPanel<D>;

    constructor(registry: Registry, canvas: AbstractCanvasPanel<D>) {
        this.registry = registry;
        this.canvas = canvas;
    }
    
    register() {
        this.registry.engine.events.pointer.add(pointerEvent => this.onPointerEvent(pointerEvent))
    }

    private onPointerEvent(pointerEvent: IPointerEvent) {
        switch(pointerEvent.eventType) {
            case IPointerEventType.PointerUp:
                this.canvas.pointer.pointerUp(pointerEvent);
            break;
            case IPointerEventType.PointerMove:
                this.canvas.pointer.pointerMove(pointerEvent);
            break;
        }
    }
}