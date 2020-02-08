import { ViewType } from "../../../../../model/View";


export interface IViewExporter {
    type: ViewType;
    export(onlyData: boolean): JSX.Element;
} 