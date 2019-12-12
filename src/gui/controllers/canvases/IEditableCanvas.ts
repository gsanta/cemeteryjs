import { IReadableCanvas } from './IReadableCanvas';
import { IWritableCanvas } from './IWritableCanvas';
import { GameObjectTemplate } from '../../../model/types/GameObjectTemplate';


export interface IEditableCanvas extends IReadableCanvas, IWritableCanvas {
    worldItemDefinitions: GameObjectTemplate[];
    setToolbarRenderer(renderFunc: () => void);
    renderToolbar();
}
