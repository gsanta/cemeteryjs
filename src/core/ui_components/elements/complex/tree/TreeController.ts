import { PropController } from "../../../../plugin/controller/FormController";

export interface TreeData {
    name: string;
    toggled: boolean;
    checked: boolean;
    children: TreeData[];
}

export abstract class TreeController extends PropController {
    abstract getData(): TreeData;
    abstract check(data: TreeData): void;
    abstract toggle(data: TreeData): void;
}