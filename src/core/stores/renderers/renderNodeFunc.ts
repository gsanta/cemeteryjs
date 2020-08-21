import { NodeView } from '../views/NodeView';
import { UI_Column } from '../../ui_regions/elements/UI_Column';

export interface renderNodeFunc {
    (nodeView: NodeView, columnt: UI_Column): void;
}