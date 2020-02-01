import { AbstractForm } from "../../../controllers/forms/AbstractForm";

export interface InputFieldCommands<P> {
    propertyName: P;
    propertyType?: "boolean" | "string" | "number" | 'file-data';
    formController: AbstractForm<P>;
}