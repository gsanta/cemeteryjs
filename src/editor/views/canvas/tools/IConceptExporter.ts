import { Concept, Subconcept } from "../models/concepts/Concept";
import { CanvasItemType } from "../models/CanvasItem";


export interface IConceptExporter {
    type: CanvasItemType;
    export(hover?: (view: Concept | Subconcept) => void, unhover?: (view: Concept | Subconcept) => void): JSX.Element;
} 