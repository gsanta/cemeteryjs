import { ConceptType, Concept } from "../models/concepts/Concept";


export interface IViewExporter {
    type: ConceptType;
    export(hover?: (view: Concept) => void, unhover?: (view: Concept) => void): JSX.Element;
} 