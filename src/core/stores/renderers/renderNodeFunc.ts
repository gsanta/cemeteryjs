import { NodeView } from '../views/NodeView';
import { UI_SvgForeignObject } from '../../ui_regions/elements/svg/UI_SvgForeignObject';

export interface renderNodeFunc {
    (nodeView: NodeView, parent_UI: UI_SvgForeignObject): void;
}