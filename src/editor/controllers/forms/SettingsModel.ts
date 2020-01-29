import { ICanvasController } from "../canvases/ICanvasController";

export class SettingsModel {
    activeEditor: ICanvasController;
    activeDialog: string;
    isWorldItemTypeEditorOpen = true;
}