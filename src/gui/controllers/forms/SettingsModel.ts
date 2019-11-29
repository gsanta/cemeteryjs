import { IEditableCanvas } from '../canvases/IEditableCanvas';

export class SettingsModel {
    activeEditor: IEditableCanvas;
    activeDialog: string;
    isWorldItemTypeEditorOpen = true;
}