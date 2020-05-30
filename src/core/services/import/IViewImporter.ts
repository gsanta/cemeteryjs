import { ViewContainerJson } from "../../../plugins/common/io/AbstractPluginImporter";
import { ConceptType } from "../../models/views/View";

export interface IViewImporter<T> {
    type: ConceptType;
    import(group: ViewContainerJson<T>): void;
} 
