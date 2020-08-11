import { UI_SvgCanvas } from '../../../core/ui_regions/elements/UI_SvgCanvas';
import { NodeView } from '../../../core/stores/views/NodeView';
import { AbstractNodeElement } from './AbstractNodeElement';
import { PathNodeControllerId } from './PathNodeController';
import { PathNodeProps } from '../settings/nodes/PathNodeSettings';
import { UI_SvgForeignObject } from '../../../core/ui_regions/elements/svg/UI_SvgForeignObject';


export class PathNodeElement extends AbstractNodeElement {
    protected renderSettingsSectionInto(foreignObject: UI_SvgForeignObject, nodeView: NodeView) {
        const row = foreignObject.row(null);
        
        row.select(PathNodeProps.PathId, PathNodeProps.AllPathes);
    }
}