import { AbstractFormController } from '../../../controllers/forms/AbstractFormController';


export interface InputFieldCommands<P> {
    propertyName: P;
    propertyType: "boolean" | "string" | "number";
    formController: AbstractFormController<P>;

}