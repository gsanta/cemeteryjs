import { ToolHandler } from '../controller/ToolHandler';
import { UI_Model } from "./UI_Model";
import { UI_Panel, UI_Region } from './UI_Panel';

export interface CanvasPlugin {
    displayName: string;
    region: UI_Region;

    getPanel(): UI_Panel;
    getToolController(): ToolHandler;
    getModel(): UI_Model;
}