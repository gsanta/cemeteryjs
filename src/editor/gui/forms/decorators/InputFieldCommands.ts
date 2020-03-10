import { AbstractSettings } from "../../../views/canvas/settings/AbstractSettings";

export interface InputFieldCommands<P> {
    propertyName: P;
    propertyType?: "boolean" | "string" | "number" | 'file-data';
    formController: AbstractSettings<P>;
}