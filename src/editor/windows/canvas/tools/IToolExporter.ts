import { ViewType, View } from "../models/views/View";


export interface IViewExporter {
    type: ViewType;
    export(hover?: (view: View) => void, unhover?: (view: View) => void): JSX.Element;
} 