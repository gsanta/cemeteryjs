
import { RawWorldMapJson } from '../../../../../../world_generator/importers/svg/WorldMapJson';
import { SvgCanvasController } from '../../SvgCanvasController';
import { Rectangle } from '../../../../../../model/geometry/shapes/Rectangle';
import { Point } from '../../../../../../model/geometry/shapes/Point';
import { CanvasItem } from '../../models/CanvasItem';
import { WorldItemShape } from '../../../../../../world_generator/services/GameObject';
import { IToolImporter } from '../IToolImporter';
import { ToolType } from '../Tool';

export class RectangleImporter implements IToolImporter {
    type = ToolType.RECTANGLE;
    private svgCanvasController: SvgCanvasController;

    constructor(svgCanvasController: SvgCanvasController) {
        this.svgCanvasController = svgCanvasController;
    }

    import(rawJson: RawWorldMapJson): void {
        const pixelSize = parseInt(rawJson.svg._attributes["data-wg-pixel-size"], 10);

        const canvasItems = rawJson.svg.rect.map(rect => {
            const type = rect._attributes["data-wg-type"];
            const x = parseInt(rect._attributes["data-wg-x"], 10) / pixelSize;
            const y = parseInt(rect._attributes["data-wg-y"], 10) / pixelSize;
            const width = parseInt(rect._attributes["data-wg-width"], 10) / pixelSize;
            const height = parseInt(rect._attributes["data-wg-height"], 10) / pixelSize;
            const shape = rect._attributes["data-wg-shape"];
            const color = rect._attributes["data-wg-color"];
            const model = rect._attributes["data-wg-model"];
            const rotation = parseInt(rect._attributes["data-rotation"], 10);
            const scale = parseFloat(rect._attributes["data-wg-scale"]);
            const name = rect._attributes["data-wg-name"];

            const rectangle = new Rectangle(new Point(x, y), new Point(x + width, y + height));

            const canvasItem: CanvasItem = {
                color: 'grey',
                dimensions: rectangle,
                type: type,
                layer: 0,
                isPreview: false,
                tags: new Set(),
                shape: <WorldItemShape> shape,
                model: model,
                rotation: rotation,
                scale: scale,
                name: name
            }

            this.svgCanvasController.canvasStore.addRect(canvasItem);
            return canvasItem;
        });

        canvasItems.filter(item => item.model).forEach(item => this.svgCanvasController.model3dController.set3dModelForCanvasItem(item));
    }
}