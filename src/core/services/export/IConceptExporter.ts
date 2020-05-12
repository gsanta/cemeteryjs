import { IControl } from "../../models/controls/IControl";
import { ConceptType, Concept } from "../../models/concepts/Concept";
import { Hoverable } from "../../models/Hoverable";

export interface IConceptExporter {
    type: ConceptType;
    export(hover?: (item: Hoverable) => void, unhover?: (item: Hoverable) => void): JSX.Element;
    exportToFile(hover?: (item: Hoverable) => void, unhover?: (item: Hoverable) => void): JSX.Element;
} 