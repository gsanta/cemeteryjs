import { WorldItemDefinitionModel } from "../world_items/WorldItemDefinitionModel";

export interface IEditorReader {
    read(worldItemDefinitionModel: WorldItemDefinitionModel): string;
}