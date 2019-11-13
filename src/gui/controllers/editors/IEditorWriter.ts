import { WorldItemDefinitionModel } from "../world_items/WorldItemDefinitionModel";


export interface IEditorWriter {
    write(worldItemDefinitionModel: WorldItemDefinitionModel): string;
}