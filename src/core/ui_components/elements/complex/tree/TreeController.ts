import { ParamController } from "../../../../controller/FormController";

export interface TreeData {
    name: string;
    toggled: boolean;
    checked: boolean;
    children?: TreeData[];
}

export abstract class TreeController extends ParamController {
    abstract getData(): TreeData[];
    abstract check(data: TreeData): void;
}