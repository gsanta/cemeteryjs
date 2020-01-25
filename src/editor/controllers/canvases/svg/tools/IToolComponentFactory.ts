import { IToolType } from "./IToolType";


export interface IToolComponentFactory extends IToolType {
    create(): JSX.Element;
}