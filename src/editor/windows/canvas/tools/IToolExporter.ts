import { ViewType } from "../models/views/View";


export interface IViewExporter {
    type: ViewType;
    export(onlyData: boolean): JSX.Element;
} 