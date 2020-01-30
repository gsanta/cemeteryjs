import { AbstractCanvasController } from "../canvases/AbstractCanvasController";

export class SettingsModel {
    activeEditor: AbstractCanvasController;
    activeDialog: string;
    isWorldItemTypeEditorOpen = true;
}