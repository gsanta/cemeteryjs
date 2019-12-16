import { SvgCanvasController } from './SvgCanvasController';
import { ICanvasReader } from '../ICanvasReader';
import { GameObjectTemplate } from '../../../../model/types/GameObjectTemplate';
import { PixelTag } from './models/GridCanvasStore';

export class SvgCanvasReader implements ICanvasReader {
    private canvasController: SvgCanvasController;

    constructor(bitmapEditorController: SvgCanvasController) {
        this.canvasController = bitmapEditorController;
    }

    read(): string {
        const rectangles = this.createRectangles(this.canvasController.worldItemDefinitions);

        return `<svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000">${rectangles.join('')}</svg>`;
    }

    private createRectangles(worldItemDefinitions: GameObjectTemplate[]): string[] {
        const pixelModel = this.canvasController.pixelModel;
        const configModel = this.canvasController.configModel;

        const orderedItems = [...pixelModel.items];
        orderedItems.sort((a, b) => a.layer - b.layer);

        return orderedItems.map(item => {
            const min = item.indexes[0];
            const max = item.indexes[item.indexes.length - 1];

            const pixelSize = configModel.pixelSize;
            const topLeft = pixelModel.getPixelPosition(min).mul(pixelSize);
            const botRight = pixelModel.getPixelPosition(max).mul(pixelSize).addX(pixelSize).addY(pixelSize);

            const fill = item.tags.includes(PixelTag.SELECTED) ? 'blue' : item.color;

            const attrs: [string, string][] = [
                ['x', `${topLeft.x}px`],
                ['y', `${topLeft.y}px`],
                ['width', `${botRight.x - topLeft.x}px`],
                ['height', `${botRight.y - topLeft.y}px`],
                ['fill', fill],
                ['data-wg-x', topLeft.x + ''],
                ['data-wg-y', topLeft.y + ''],
                ['data-wg-width',  `${botRight.x - topLeft.x}`],
                ['data-wg-height',  `${botRight.y - topLeft.y}`],
                ['data-wg-type', item.type],
                ['data-wg-shape', item.shape],
                ['data-wg-color', item.color],
                ['data-wg-layer', item.layer + '']
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