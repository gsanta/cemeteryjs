import { ViewType } from "../../../common/views/View";


export interface IViewExporter {
    type: ViewType;
    export(onlyData: boolean): JSX.Element;
} 