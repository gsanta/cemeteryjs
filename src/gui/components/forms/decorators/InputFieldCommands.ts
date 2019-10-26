import { FormController } from '../../../controllers/FormController';


export interface InputFieldCommands<P> {
    propertyName: P;
    propertyType: "boolean" | "string" | "number";
    formController: FormController<P>;

}