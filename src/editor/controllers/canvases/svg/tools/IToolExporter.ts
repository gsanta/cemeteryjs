import { IToolType } from "./IToolType";


export interface IToolExporter extends IToolType {
    export(onlyData: boolean): JSX.Element;
} 