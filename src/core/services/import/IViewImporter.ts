import { ViewContainerJson } from "../../../plugins/common/io/AbstractPluginImporter";
import { ConceptType, View } from "../../models/views/View";

export interface IViewImporter<T> {
    type: ConceptType;
    import(group: ViewContainerJson<T>, viewMap: Map<string, View>): void;
} 
