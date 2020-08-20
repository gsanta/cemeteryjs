import { NodeView } from '../views/NodeView';
import { UI_Row } from '../../ui_regions/elements/UI_Row';

export interface renderNodeFunc {
    (nodeView: NodeView, row: UI_Row): void;
}