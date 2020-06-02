import { ConceptType, ViewJson } from "../../../core/models/views/View";

export interface ViewGroupJson {
    viewType: string;
    views: ViewJson[];
}

export interface IViewExporter {
    viewType: ConceptType;
    export(): ViewGroupJson;
} 