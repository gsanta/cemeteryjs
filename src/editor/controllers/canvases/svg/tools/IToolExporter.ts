import { IToolType } from "./IToolType";


export interface IToolExporter extends IToolType {
    export(): JSX.Element;
} 