import { ConceptType, View } from "../../models/views/View";

export interface IConceptExporter {
    type: ConceptType;
    export(hover?: (item: View) => void, unhover?: (item: View) => void): JSX.Element;
    exportToFile(hover?: (item: View) => void, unhover?: (item: View) => void): JSX.Element;
} 