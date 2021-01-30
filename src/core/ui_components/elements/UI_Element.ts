import { Point } from '../../../utils/geometry/shapes/Point';
import { AbstractCanvasPanel } from '../../plugin/AbstractCanvasPanel';
import { FormController, ParamController } from '../../controller/FormController';
import { UI_Panel } from '../../plugin/UI_Panel';
import { Registry } from '../../Registry';
import { UI_ElementType } from './UI_ElementType';

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

    canvasPanel: AbstractCanvasPanel;
    panel: UI_Panel;
    
    isBold: boolean;
    data: any;
    //TODO: consider restrict it only to svg elements
    scopedToolId: string;
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
        this.canvasPanel && this.canvasPanel.tool.mouseDown(e, this.scopedToolId);
    }

    mouseMove(registry: Registry, e: MouseEvent) {
        this.canvasPanel && this.canvasPanel.tool.mouseMove(e, this.scopedToolId);
    }

    mouseUp(registry: Registry, e: MouseEvent) {
        this.canvasPanel && this.canvasPanel.tool.mouseUp(e, this.scopedToolId);
    }

    mouseLeave(registry: Registry, e: MouseEvent, data?: any) {
        this.canvasPanel && this.canvasPanel.tool.mouseLeave(e, data, this.scopedToolId);
    }

    mouseEnter(registry: Registry, e: MouseEvent, data?: any) {
        this.canvasPanel && this.canvasPanel.tool.mouseEnter(e, data, this.scopedToolId);
    }

    mouseWheel(registry: Registry, e: WheelEvent) {
        this.canvasPanel && this.canvasPanel.tool.mouseWheel(e);
    }

    mouseWheelEnd(registry: Registry) {
        this.canvasPanel && this.canvasPanel.tool.mouseWheelEnd();
    }

    keyDown(registry: Registry, e: KeyboardEvent) {
        this.canvasPanel && this.canvasPanel.keyboard.keyDown(e);
    }

    keyUp(registry: Registry, e: KeyboardEvent) {
        this.canvasPanel && this.canvasPanel.keyboard.keyUp(e);
    }

    dndEnd(registry: Registry, point: Point) {
        this.canvasPanel && this.canvasPanel.tool.dndDrop(point);
    }
}

