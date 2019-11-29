import { IReadableCanvas } from './IReadableCanvas';
import { IWritableCanvas } from './IWritableCanvas';
import { WorldItemDefinition } from '../../../WorldItemDefinition';


export interface IEditableCanvas extends IReadableCanvas, IWritableCanvas {
    worldItemDefinitions: WorldItemDefinition[];
    setToolbarRenderer(renderFunc: () => void);
    renderToolbar();
}
