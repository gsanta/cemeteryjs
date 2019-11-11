import { IFormController } from '../../../controllers/IFormController';


export interface InputFieldCommands<P> {
    propertyName: P;
    propertyType: "boolean" | "string" | "number";
    formController: IFormController<P>;

}