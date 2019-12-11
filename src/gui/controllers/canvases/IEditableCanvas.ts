import { IReadableCanvas } from './IReadableCanvas';
import { IWritableCanvas } from './IWritableCanvas';
import { WorldItemTemplate } from '../../../WorldItemTemplate';


export interface IEditableCanvas extends IReadableCanvas, IWritableCanvas {
    worldItemDefinitions: WorldItemTemplate[];
    setToolbarRenderer(renderFunc: () => void);
    renderToolbar();
}
