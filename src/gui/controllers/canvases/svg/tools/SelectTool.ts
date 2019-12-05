import { ToolType } from "./Tool";
import { AbstractSelectionTool } from "./AbstractSelectionTool";
import { SvgCanvasController } from "../SvgCanvasController";
import { WorldMapGraph } from '../../../../../WorldMapGraph';
import { SvgWorldMapReader } from '../../../../../model/readers/svg/SvgWorldMapReader';
import { PixelTag } from "../models/PixelModel";
import { Point } from "@nightshifts.inc/geometry";


export class SelectTool extends AbstractSelectionTool {
    private worldMapGraph: WorldMapGraph;

    constructor(canvasController: SvgCanvasController) {
        super(canvasController, ToolType.SELECT, true);
    }

    click() {
        super.click();

        PixelTag.removeTag(PixelTag.SELECTED, this.canvasController.pixelModel.items);

        const pixelSize = this.canvasController.configModel.pixelSize;

        const gridPoint = new Point(this.canvasController.mouseController.movePoint.x / pixelSize, this.canvasController.mouseController.movePoint.y / pixelSize);
        const items = this.canvasController.pixelModel.getIntersectingItemsAtPoint(gridPoint);

        items.forEach(item => item.tags.push(PixelTag.SELECTED));

        // const pixel = this.canvasController.pixelModel.getTopPixelAtCoordinate(this.canvasController.mouseController.movePoint);

        // if (pixel) {
        //     const graphNode = this.worldMapGraph.getNodeAtPosition(this.canvasController.pixelModel.getPixelPosition(pixel.index));
        //     const comp = this.worldMapGraph.getConnectedComponentForNode(graphNode);
    
        //     comp.getAllNodes().map(node => {
        //         const index = this.canvasController.pixelModel.getIndexAtPosition(comp.getNodePositionInMatrix(node))
    
        //         this.canvasController.pixelModel.getPixel(index).tags.push(PixelTag.SELECTED);
        //     });
        // }

        this.canvasController.renderCanvas();
        this.canvasController.renderSettings();
    }

    activate() {
        this.worldMapGraph = new SvgWorldMapReader(false).read(this.canvasController.reader.read());
    }
}