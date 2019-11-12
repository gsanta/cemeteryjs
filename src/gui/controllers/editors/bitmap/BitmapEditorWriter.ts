import { IEditorWriter } from '../IEditorWriter';
import { BitmapEditorController } from './BitmapEditorController';


export class BitmapEditorWriter implements IEditorWriter {
    private bitmapEditorController: BitmapEditorController;

    constructor(bitmapEditorController: BitmapEditorController) {
        this.bitmapEditorController = bitmapEditorController;
    }

    write(): string {

    }
}