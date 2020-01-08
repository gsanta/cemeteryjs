import { SvgCanvasController } from './SvgCanvasController';
import { ICanvasExporter } from '../ICanvasExporter';
import { GameObjectTemplate } from '../../../../world_generator/services/GameObjectTemplate';
import { Rectangle } from '../../../../model/geometry/shapes/Rectangle';
import { CanvasItemTag, CanvasItem } from './models/CanvasItem';
import { minBy } from '../../../../model/geometry/utils/Functions';

export class SvgCanvasExporter implements ICanvasExporter {
    private canvasController: SvgCanvasController;

    constructor(canvasController: SvgCanvasController) {
        this.canvasController = canvasController;
    }

    export(): string {
        const rectangles = this.createRectangles();

        return `<svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000">${rectangles.join('')}</svg>`;
    }

    private createRectangles(): string[] {
        const pixelModel = this.canvasController.pixelModel;
        const configModel = this.canvasController.configModel;

        if (pixelModel.items.length === 0) { return []; }

        const minX = minBy<CanvasItem>(pixelModel.items, (a, b) => a.dimensions.topLeft.x - b.dimensions.topLeft.x).dimensions.topLeft.x;
        const minY = minBy<CanvasItem>(pixelModel.items, (a, b) => a.dimensions.topLeft.y - b.dimensions.topLeft.y).dimensions.topLeft.y;
        
        const pixelSize = configModel.pixelSize;
        const tranlateX = minX < 0 ? - minX * pixelSize : 0;
        const tranlateY = minY < 0 ? - minY * pixelSize : 0;

        const orderedItems = [...pixelModel.items];
        orderedItems.sort((a, b) => a.layer - b.layer);

        return orderedItems.map(item => {
            const rectangle = <Rectangle> item.dimensions;

            const fill = item.tags.has(CanvasItemTag.SELECTED) ? 'blue' : item.color;

            const x = rectangle.topLeft.x * pixelSize;
            const y = rectangle.topLeft.y * pixelSize;
            const width = (rectangle.bottomRight.x - rectangle.topLeft.x) * pixelSize;
            const height = (rectangle.bottomRight.y - rectangle.topLeft.y) * pixelSize;

            const attrs: [string, string][] = [
                ['x', `${x}px`],
                ['y', `${y}px`],
                ['width', `${width}px`],
                ['height', `${height}px`],
                ['fill', fill],
                ['data-wg-x', `${x + tranlateX}`],
                ['data-wg-y', `${y + tranlateY}`],
                ['data-wg-width',  `${width}`],
                ['data-wg-height',  `${height}`],
                ['data-wg-type', item.type],
                ['data-wg-shape', item.shape],
                ['data-wg-color', item.color],
                ['data-wg-layer', item.layer + ''],
                ['data-rotation', item.rotation + ''],
                ['data-wg-scale', item.scale + ''],
            ];

            if (item.model) {
                attrs.push(['data-wg-model', item.model]);
            }

            return this.createTag('rect', attrs);
        });
    }

    private createTag(tagName: string, attributes: [string, string][], content: string = ''): string {
        const attrs = attributes.map(attr => `${attr[0]}="${attr[1]}"`); 

        return `<${tagName} ${attrs.join(' ')}>${content}</${tagName}>`;
    }
}