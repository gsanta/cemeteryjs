import { AbstractForm } from "../../../views/canvas/forms/AbstractForm";

export interface InputFieldCommands<P> {
    propertyName: P;
    propertyType?: "boolean" | "string" | "number" | 'file-data';
    formController: AbstractForm<P>;
}