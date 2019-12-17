import { ToolType } from "./Tool";
import { AbstractSelectionTool } from "./AbstractSelectionTool";
import { SvgCanvasController } from "../SvgCanvasController";
import { WorldMapGraph } from '../../../../../model/types/WorldMapGraph';
import { SvgWorldMapReader } from '../../../../../model/readers/svg/SvgWorldMapReader';
import { PixelTag } from "../models/GridCanvasStore";
import { Point } from "@nightshifts.inc/geometry";


export class SelectTool extends AbstractSelectionTool {

    constructor(canvasController: SvgCanvasController) {
        super(canvasController, ToolType.SELECT, true);
    }

    click() {
        super.click();

        PixelTag.removeTag(PixelTag.SELECTED, this.canvasController.pixelModel.items);

        const items = this.canvasController.pixelModel.getIntersectingItemsAtPoint(this.canvasController.mouseController.movePoint);

        items.forEach(item => item.tags.push(PixelTag.SELECTED));

        this.canvasController.renderCanvas();
        this.canvasController.renderSettings();
    }
}