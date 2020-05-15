import { IControl } from "../../models/views/control/IControl";
import { ConceptType, View } from "../../models/views/View";
import { Hoverable } from "../../models/Hoverable";

export interface IConceptExporter {
    type: ConceptType;
    export(hover?: (item: Hoverable) => void, unhover?: (item: Hoverable) => void): JSX.Element;
    exportToFile(hover?: (item: Hoverable) => void, unhover?: (item: Hoverable) => void): JSX.Element;
} 