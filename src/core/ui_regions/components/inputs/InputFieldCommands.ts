import { AbstractSettings } from "../../../../plugins/ui_plugins/AbstractSettings";

export interface InputFieldCommands<P> {
    propertyName: P;
    propertyType?: "boolean" | "string" | "number" | 'file-data';
    formController: AbstractSettings<P>;
    onChange: (val: string) => void;
}