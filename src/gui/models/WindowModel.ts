
export enum EditorType {
    TEXT_EDITOR = 'text-editor',
    BITMAP_EDITOR = 'bitmap-editor'
}

export class WindowModel {
    activeEditor: EditorType = EditorType.BITMAP_EDITOR;
    isWorldItemTypeEditorOpen = true;
}