import { SvgCanvasController } from './SvgCanvasController';
import { ICanvasExporter } from '../ICanvasExporter';
import { GameObjectTemplate } from '../../../../world_generator/services/GameObjectTemplate';
import { Rectangle } from '../../../../model/geometry/shapes/Rectangle';
import { CanvasItemTag } from './models/CanvasItem';

export class SvgCanvasExporter implements ICanvasExporter {
    private canvasController: SvgCanvasController;

    constructor(bitmapEditorController: SvgCanvasController) {
        this.canvasController = bitmapEditorController;
    }

    export(): string {
        const rectangles = this.createRectangles(this.canvasController.worldItemDefinitions);

        return `<svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000">${rectangles.join('')}</svg>`;
    }

    private createRectangles(worldItemDefinitions: GameObjectTemplate[]): string[] {
        const pixelModel = this.canvasController.pixelModel;
        const configModel = this.canvasController.configModel;

        const orderedItems = [...pixelModel.items];
        orderedItems.sort((a, b) => a.layer - b.layer);

        return orderedItems.map(item => {
            const rectangle = <Rectangle> item.dimensions;
            const pixelSize = configModel.pixelSize;

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
                ['data-wg-x', `${x}`],
                ['data-wg-y', `${y}`],
                ['data-wg-width',  `${width}`],
                ['data-wg-height',  `${height}`],
                ['data-wg-type', item.type],
                ['data-wg-shape', item.shape],
                ['data-wg-color', item.color],
                ['data-wg-layer', item.layer + ''],
                ['data-rotation', item.rotation + '']
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