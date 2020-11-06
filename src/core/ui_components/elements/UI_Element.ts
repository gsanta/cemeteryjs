import { Point } from '../../../utils/geometry/shapes/Point';
import { AbstractCanvasPanel } from '../../plugin/AbstractCanvasPanel';
import { ToolController } from '../../plugin/controller/ToolController';
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
}

export interface UI_ElementConfig {
    key?: string;
}

export abstract class UI_Element {
    elementType: UI_ElementType;
    pluginId: string;
    controllerId: string;
    readonly key: string;

    readonly canvasPanel: AbstractCanvasPanel;
    
    isBold: boolean;
    data: any;
    //TODO: consider restrict it only to svg elements
    scopedToolId: string;
    isInteractive: boolean = true;
    targetId: string;

    readonly uniqueId: string;
    readonly toolController: ToolController;

    css?: UI_Element_Css = {};

    constructor(config: {pluginId: string, key?: string, target?: string, uniqueId?: string, toolController?: ToolController} = { pluginId: undefined }) {
        this.pluginId = config.pluginId;
        this.targetId = config.target;
        this.uniqueId = config.uniqueId;
        this.toolController = config.toolController;
        this.key = config.key;
    }

    mouseDown(registry: Registry, e: MouseEvent) {
        if (registry.plugins.getPlugin(this.pluginId).getToolController()) {
            registry.plugins.getPlugin(this.pluginId).getToolController().mouseDown(e, this);
        }
    }

    mouseMove(registry: Registry, e: MouseEvent) {
        if (registry.plugins.getPlugin(this.pluginId).getToolController()) {
            registry.plugins.getPlugin(this.pluginId).getToolController().mouseMove(e, this);
        }
    }

    mouseUp(registry: Registry, e: MouseEvent) {
        if (registry.plugins.getPlugin(this.pluginId).getToolController()) {
            registry.plugins.getPlugin(this.pluginId).getToolController().mouseUp(e, this);
        }
    }

    mouseLeave(registry: Registry, e: MouseEvent, data?: any) {
        if (registry.plugins.getPlugin(this.pluginId).getToolController()) {
            registry.plugins.getPlugin(this.pluginId).getToolController().mouseLeave(e, data, this);
        }
    }

    mouseEnter(registry: Registry, e: MouseEvent, data?: any) {
        if (registry.plugins.getPlugin(this.pluginId).getToolController()) {
            registry.plugins.getPlugin(this.pluginId).getToolController().mouseEnter(e, data, this);
        }
    }

    mouseWheel(registry: Registry, e: WheelEvent) {
        if (registry.plugins.getPlugin(this.pluginId).getToolController()) {
            registry.plugins.getPlugin(this.pluginId).getToolController().mouseWheel(e);
        }
    }

    mouseWheelEnd(registry: Registry) {
        if (registry.plugins.getPlugin(this.pluginId).getToolController()) {
            registry.plugins.getPlugin(this.pluginId).getToolController().mouseWheelEnd();
        }
    }

    keyDown(registry: Registry, e: KeyboardEvent) {
        (registry.plugins.getPanelById(this.pluginId) as AbstractCanvasPanel).keyboard.keyDown(e);
    }

    keyUp(registry: Registry, e: KeyboardEvent) {
        (registry.plugins.getPanelById(this.pluginId) as AbstractCanvasPanel).keyboard.keyUp(e);
    }

    dndEnd(registry: Registry, point: Point) {
        if (registry.plugins.getPlugin(this.pluginId).getToolController()) {
            registry.plugins.getPlugin(this.pluginId).getToolController().dndDrop(point, this);
        }
    }
}

