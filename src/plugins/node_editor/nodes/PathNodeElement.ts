import { NodeView } from '../../../core/stores/views/NodeView';
import { AbstractNodeElement } from './AbstractNodeElement';
import { PathNodeProps } from '../settings/nodes/PathNodeSettings';
import { UI_SvgForeignObject } from '../../../core/ui_regions/elements/svg/UI_SvgForeignObject';


export class PathNodeElement extends AbstractNodeElement {
    protected renderSettingsSectionInto(foreignObject: UI_SvgForeignObject, nodeView: NodeView) {
        const row = foreignObject.row(null);
        
        // const select = row.select(PathNodeProps.PathId, PathNodeProps.AllPathes);
        // select.values = 
    }
}