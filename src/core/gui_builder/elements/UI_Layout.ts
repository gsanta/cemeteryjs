import { UI_ElementType } from "./UI_ElementType";
import { UI_Row } from "./UI_Row";
import { UI_Container } from "./UI_Container";
import { UI_SvgCanvas } from './UI_SvgCanvas';
import { UI_Region, UI_Plugin } from '../../UI_Plugin';
import { UI_Factory } from '../UI_Factory';

const elementType = UI_ElementType.Layout;

export class UI_Layout extends UI_Container {
    elementType = elementType;

    constructor(plugin: UI_Plugin, region: UI_Region) {
        super(plugin);

        this.id = `${plugin.id}_region-${region}_${elementType}`;
    }

    row(config: {controllerId?: string}): UI_Row {
        return UI_Factory.row(this, config);
    }

    svgCanvas(config: {controllerId?: string}): UI_SvgCanvas {
        return UI_Factory.svgCanvas(this, config);
    }
}