import { ViewType } from "../../../../../common/views/View";
import { ViewGroupJson } from "../../../../../common/importers/ViewImporter";

export interface IViewImporter {
    type: ViewType;
    import(group: ViewGroupJson): void;
} 

export function getImporterByType(toolType: ViewType, importers: IViewImporter[]) {
    return importers.find(tool => tool.type === toolType);
}