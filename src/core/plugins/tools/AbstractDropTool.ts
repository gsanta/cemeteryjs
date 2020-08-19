import { AbstractTool } from './AbstractTool';
import { ToolType } from './Tool';
import { AbstractCanvasPlugin } from '../AbstractCanvasPlugin';
import { Registry } from '../../Registry';


export class AbstractDropTool extends AbstractTool {

    constructor(type: ToolType, plugin: AbstractCanvasPlugin, registry: Registry) {
        super(type, plugin, registry);
    }

    up() {
        this.registry.plugins.getHoveredView()
    }
}