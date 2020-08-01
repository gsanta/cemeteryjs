import { UI_SvgCanvas } from '../../../core/gui_builder/elements/UI_SvgCanvas';
import { NodeView } from '../../../core/models/views/NodeView';
import { AbstractNodeElement } from './AbstractNodeElement';
import { PathNodeControllerId } from './PathNodeController';
import { PathNodeProps } from '../settings/nodes/PathNodeSettings';
import { UI_Box } from '../../../core/gui_builder/elements/UI_Box';
import { UI_SvgForeignObject } from '../../../core/gui_builder/elements/svg/UI_SvgForeignObject';


export class PathNodeElement extends AbstractNodeElement {
    protected renderSettingsSectionInto(foreignObject: UI_SvgForeignObject, nodeView: NodeView) {
        const row = foreignObject.row(null);
        
        const pathIdSelect = row.select(PathNodeProps.PathId, PathNodeProps.AllPathes);
        const controller = this.plugin.getControllerById(PathNodeControllerId);
    }
}