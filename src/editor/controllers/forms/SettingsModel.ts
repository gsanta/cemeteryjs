import { IEditableCanvas } from '../formats/IEditableCanvas';

export class SettingsModel {
    activeEditor: IEditableCanvas;
    activeDialog: string;
    isWorldItemTypeEditorOpen = true;
}