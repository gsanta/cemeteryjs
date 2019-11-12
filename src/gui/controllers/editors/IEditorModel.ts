import { FileFormat } from "../../../WorldGenerator";
import { WorldItemDefinitionModel } from "../world_items/WorldItemDefinitionModel";

export interface IEditorModel {
    getFileFormat(): FileFormat;
    getFile(worldItemDefinitionModel: WorldItemDefinitionModel): string;
}