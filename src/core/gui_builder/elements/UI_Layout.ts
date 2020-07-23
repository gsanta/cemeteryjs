import { UI_ElementType } from "./UI_ElementType";
import { UI_Row } from "./UI_Row";
import { UI_Container } from "./UI_Container";
import { UI_SvgCanvas } from './UI_SvgCanvas';
import { AbstractController } from '../../../plugins/scene_editor/settings/AbstractController';
import { UI_Region } from '../../UI_Plugin';

const elementType = UI_ElementType.Layout;

export class UI_Layout extends UI_Container {
    elementType = elementType;

    private region: UI_Region;

    constructor(controller: AbstractController, region: UI_Region) {
        super(controller);

        this.id = `${controller.plugin.id}_region-${region}_${elementType}`;
        this.region = region;
    }

    row(): UI_Row {
        const row = new UI_Row(this.controller);
        this.children.push(row);

        return row;
    }

    svgCanvas(): UI_SvgCanvas {
        const svgCanvas = new UI_SvgCanvas(this.controller);
        this.children.push(svgCanvas);

        return svgCanvas;
    }
}