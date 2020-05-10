import { AbstractSettings } from "../../../plugins/scene_editor/settings/AbstractSettings";

export interface InputFieldCommands<P> {
    propertyName: P;
    propertyType?: "boolean" | "string" | "number" | 'file-data';
    formController: AbstractSettings<P>;
}