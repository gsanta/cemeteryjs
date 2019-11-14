import { IEditorController } from '../editors/IEditorController';
import { IReadableEditor } from '../editors/IReadableEditor';
import { IWritableEditor } from '../editors/IWritableEditor';


export class SettingsModel {
    activeEditor: IEditorController & IReadableEditor & IWritableEditor;
    isWorldItemTypeEditorOpen = true;
}