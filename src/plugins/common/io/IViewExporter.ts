import { ConceptType } from "../../../core/models/views/View";

export interface IViewExporter {
    viewType: ConceptType;
    export(): string;
} 