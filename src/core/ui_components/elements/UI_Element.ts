import { Point } from '../../../utils/geometry/shapes/Point';
import { AbstractCanvasPanel } from '../../models/modules/AbstractCanvasPanel';
import { FormController, ParamController } from '../../controller/FormController';
import { UI_Panel } from '../../models/UI_Panel';
import { Registry } from '../../Registry';
import { UI_ElementType } from './UI_ElementType';
import { MouseEventAdapter } from '../../controller/MouseEventAdapter';
import { AbstractShape } from '../../models/shapes/AbstractShape';

export const activeToolId = '__activeTool__'

export interface UI_Element_Css {
    fill?: string;
    stroke?: string;
    strokeWidth?: string;
    strokeOpacity?: number;
    strokeDasharray?: string;
    pointerEvents?: 'none' | 'all';
    userSelect?: 'auto' | 'text' | 'none' | 'all';
    opacity?: number;
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontWeight?: "bold" | "normal" | number;
    height?: string;
    padding?: string;
    margin?: string;
    markerMid?: string;
    markerStart?: string;
    markerEnd?: string;
}

export interface UI_ElementConfig {
    key?: string;
    controller?: FormController;
}

export interface UI_ControlledElementConfig<C extends ParamController> {
    key?: string;
    controller: C;
    parent: UI_Element;
}

export abstract class UI_Element<C extends ParamController = any> {
    elementType: UI_ElementType;
    readonly key: string;

    canvasPanel: AbstractCanvasPanel<any>;
    panel: UI_Panel;
    
    isBold: boolean;
    data: any;
    isInteractive: boolean = true;

    uniqueId: string;
    readonly controller: FormController;
    paramController: C;
    readonly parent: UI_Element;

    css?: UI_Element_Css = {};

    constructor(config: {controller: FormController, key?: string, uniqueId?: string, parent?: UI_Element, paramController?: C}) {
        this.uniqueId = config.uniqueId;
        this.controller = config.controller;
        this.key = config.key;
        this.parent = config.parent;
        this.paramController = config.paramController;
    }

    mouseDown(registry: Registry, e: MouseEvent) {
        if (this.canvasPanel) {
            const pointerEvent = MouseEventAdapter.mouseDown(e);
            this.canvasPanel.pointer.pointerDown(pointerEvent);
        }
    }

    mouseMove(registry: Registry, e: MouseEvent) {
        if (this.canvasPanel) {
            const pointerEvent = MouseEventAdapter.mouseMove(e);
            this.canvasPanel.pointer.pointerMove(pointerEvent);
        }
    }

    mouseUp(registry: Registry, e: MouseEvent) {
        if (this.canvasPanel) {
            const pointerEvent = MouseEventAdapter.mouseUp(e);
            this.canvasPanel.pointer.pointerUp(pointerEvent);
        }
    }

    mouseLeave(registry: Registry, e: MouseEvent, data?: any) {
        if (this.canvasPanel) {
            const pointerEvent = MouseEventAdapter.mouseOut(e, data.getFqn());
            this.canvasPanel.pointer.pointerOut(pointerEvent);
        }
    }

    mouseEnter(registry: Registry, e: MouseEvent, data?: AbstractShape) {
        if (this.canvasPanel) {
            const pointerEvent = MouseEventAdapter.mouseOver(e, data.getFqn());
            this.canvasPanel.pointer.pointerOver(pointerEvent);
        }
    }

    mouseWheel(registry: Registry, e: WheelEvent) {
        if (this.canvasPanel) {
            const pointerEvent = MouseEventAdapter.mouseWheel(e);
            this.canvasPanel.pointer.pointerWheel(pointerEvent);
        }
    }

    mouseWheelEnd(registry: Registry) {
        if (this.canvasPanel) {
            this.canvasPanel.pointer.pointerWheelEnd()
        }
    }

    keyDown(registry: Registry, e: KeyboardEvent) {
        this.canvasPanel && this.canvasPanel.keyboard.keyDown(e);
    }

    keyUp(registry: Registry, e: KeyboardEvent) {
        this.canvasPanel && this.canvasPanel.keyboard.keyUp(e);
    }

    dndEnd(registry: Registry, point: Point) {
        if (this.canvasPanel) {
            const e = <MouseEvent> {x: point.x, y: point.y};
            const pointerEvent = MouseEventAdapter.mouseUp(e);
            this.canvasPanel.pointer.pointerDrop(pointerEvent);
        }
    }
}

