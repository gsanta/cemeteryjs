
import { RawWorldMapJson, ToolGroupJson } from '../../../../../../world_generator/importers/svg/WorldMapJson';
import { SvgCanvasController } from '../../SvgCanvasController';
import { Rectangle } from '../../../../../../model/geometry/shapes/Rectangle';
import { Point } from '../../../../../../model/geometry/shapes/Point';
import { CanvasRect } from '../../models/CanvasItem';
import { WorldItemShape } from '../../../../../../world_generator/services/GameObject';
import { IToolImporter } from '../IToolImporter';
import { ToolType } from '../Tool';

export interface RectJson {
    _attributes: {
        "data-wg-x": string,
        "data-wg-y": string,
        "data-wg-type": string,
        "data-wg-name": string,
        "data-texture": string
    }
}

export interface RectangleGroupJson extends ToolGroupJson {
    rect: RectJson[];
}

export class RectangleImporter implements IToolImporter {
    type = ToolType.RECTANGLE;
    private addRect: (rect: CanvasRect) => void;

    constructor(addRect: (rect: CanvasRect) => void) {
        this.addRect = addRect;
    }

    import(group: RectangleGroupJson): void {
        const pixelSize = 10;

        const rectJsons =  group.rect.length ? <RectJson[]> group.rect : [<RectJson> <unknown> group.rect];

        rectJsons.forEach(rect => {
            const type = rect._attributes["data-wg-type"];
            const x = parseInt(rect._attributes["data-wg-x"], 10) / pixelSize;
            const y = parseInt(rect._attributes["data-wg-y"], 10) / pixelSize;
            const width = parseInt(rect._attributes["data-wg-width"], 10) / pixelSize;
            const height = parseInt(rect._attributes["data-wg-height"], 10) / pixelSize;
            const shape = rect._attributes["data-wg-shape"];
            const model = rect._attributes["data-wg-model"];
            const texture = rect._attributes["data-texture"];
            const rotation = parseInt(rect._attributes["data-rotation"], 10);
            const scale = parseFloat(rect._attributes["data-wg-scale"]);
            const name = rect._attributes["data-wg-name"];

            const rectangle = new Rectangle(new Point(x, y), new Point(x + width, y + height));

            const canvasItem: CanvasRect = {
                color: 'grey',
                dimensions: rectangle,
                type: type,
                shape: <WorldItemShape> shape,
                modelPath: model,
                rotation: rotation,
                scale: scale,
                name: name,
                texturePath: texture
            }

            this.addRect(canvasItem);
        });
    }
}