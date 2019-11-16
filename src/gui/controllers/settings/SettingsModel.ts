import { ICanvasController } from '../canvases/ICanvasController';
import { IReadableCanvas } from '../canvases/IReadableCanvas';
import { IWritableCanvas } from '../canvases/IWritableCanvas';


export class SettingsModel {
    activeEditor: ICanvasController & IReadableCanvas & IWritableCanvas;
    isWorldItemTypeEditorOpen = true;
}