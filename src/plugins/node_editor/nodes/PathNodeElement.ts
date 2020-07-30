import { UI_SvgCanvas } from '../../../core/gui_builder/elements/UI_SvgCanvas';
import { NodeView } from '../../../core/models/views/NodeView';
import { AbstractNodeElement } from './AbstractNodeElement';
import { PathNodeControllerId } from './PathNodeController';
import { PathNodeProps } from '../settings/nodes/PathNodeSettings';
import { UI_Box } from '../../../core/gui_builder/elements/UI_Box';


export class PathNodeElement extends AbstractNodeElement {

    renderInto(svgCanvas: UI_SvgCanvas, node: NodeView) {
        
        
        
        
    }
    
    renderNodeBodyInto(box: UI_Box) {
        const row = box.row(null);
        
        const pathIdSelect = row.select(PathNodeProps.PathId, PathNodeProps.AllPathes);
        const controller = this.plugin.getControllerById(PathNodeControllerId);
    }
}