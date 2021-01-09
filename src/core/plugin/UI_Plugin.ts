import { UI_Panel, UI_Region } from './UI_Panel';
import { FormController } from '../controller/FormController';
import { ToolController } from '../controller/ToolController';
import { UI_Model } from "./UI_Model";
import { Point } from "../../utils/geometry/shapes/Point";
import { Camera2D } from "../models/misc/camera/Camera2D";
import { Registry } from "../Registry";
import { UI_Container } from "../ui_components/elements/UI_Container";
import { View } from '../models/views/View';
import { UI_Element } from '../ui_components/elements/UI_Element';

export function getScreenSize(canvasId: string): Point {
    if (typeof document !== 'undefined') {
        const svg: HTMLElement = document.getElementById(canvasId);

        if (svg) {
            const rect: ClientRect = svg.getBoundingClientRect();
            return new Point(rect.width, rect.height);
        }
    }
    return undefined;
}

export const DUMMY_CAMERA_SIZE = new Point(100, 100);

export function cameraInitializer(canvasId: string, registry: Registry) {
    const screenSize = getScreenSize(canvasId);
    if (screenSize) {
        return new Camera2D(registry, new Point(screenSize.x, screenSize.y));
    } else {
        return new Camera2D(registry, DUMMY_CAMERA_SIZE);
    }
}


export interface CanvasPlugin {
    displayName: string;
    region: UI_Region;

    getPanel(): UI_Panel;
    getToolController(): ToolController;
    getModel(): UI_Model;
}