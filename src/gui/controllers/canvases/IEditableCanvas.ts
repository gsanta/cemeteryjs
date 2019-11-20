import { WorldItemDefinitionForm } from '../world_items/WorldItemDefinitionForm';
import { WorldItemDefinitionModel } from '../world_items/WorldItemDefinitionModel';
import { IReadableCanvas } from './IReadableCanvas';
import { IWritableCanvas } from './IWritableCanvas';


export interface IEditableCanvas extends IReadableCanvas, IWritableCanvas {
    worldItemDefinitionModel: WorldItemDefinitionModel;
    worldItemDefinitionForm: WorldItemDefinitionForm;
}