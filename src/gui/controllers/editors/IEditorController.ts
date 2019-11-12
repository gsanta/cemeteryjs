import { IEditorModel } from "./IEditorModel";

export interface IEditorController {
    getId(): string;
    resize(): void;
    getModel(): IEditorModel;
}