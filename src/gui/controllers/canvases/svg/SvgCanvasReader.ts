import { SvgCanvasController } from './SvgCanvasController';
import { ICanvasReader } from '../ICanvasReader';
import { WorldItemDefinition } from '../../../../WorldItemDefinition';
import { PixelTag } from './models/PixelModel';

export class SvgCanvasReader implements ICanvasReader {
    private canvasController: SvgCanvasController;

    constructor(bitmapEditorController: SvgCanvasController) {
        this.canvasController = bitmapEditorController;
    }

    read(): string {
        const metaData = this.createMetaData(this.canvasController.worldItemDefinitions);
        const pixels = this.createPixels(this.canvasController.worldItemDefinitions);
        const rectangles = this.createRectangles(this.canvasController.worldItemDefinitions);
        const shapes = [...pixels, ...rectangles];

        return `<svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000">${metaData}${shapes.join('')}</svg>`;
    }

    private createPixels(worldItemDefinitions: WorldItemDefinition[]): string[] {
        const pixelModel = this.canvasController.pixelModel;
        const configModel = this.canvasController.configModel;

        const pixelArray = Array.from(pixelModel.bitMap);

        const elements: string[] = [];

        pixelArray.forEach(([index, pixels]) => {
            pixels.forEach(pixel => {
                const pixelSize = configModel.pixelSize;
                const pos = pixelModel.getPixelPosition(index).mul(pixelSize);
                const color = WorldItemDefinition.getByTypeName(pixel.type, worldItemDefinitions).color;
    
                const attrs: [string, string][] = [
                    ['width', '10px'],
                    ['height', '10px'],
                    ['x', `${pos.x}px`],
                    ['y', `${pos.y}px`],
                    ['fill', pixel.tags.includes(PixelTag.SELECTED) ? 'blue' : color],
                    ['data-wg-x', pos.x + ''],
                    ['data-wg-y', pos.y + ''],
                    ['data-wg-width', pixelSize + ''],
                    ['data-wg-height', pixelSize + ''],    
                    ['data-wg-type', pixel.type]
                ];
                
                elements.push(this.createTag('rect', attrs));
            });
        });

        return elements;
    }

    private createRectangles(worldItemDefinitions: WorldItemDefinition[]): string[] {
        const pixelModel = this.canvasController.pixelModel;
        const configModel = this.canvasController.configModel;

        return pixelModel.items.map(item => {
            const min = item.indexes[0];
            const max = item.indexes[item.indexes.length - 1];

            const pixelSize = configModel.pixelSize;
            const topLeft = pixelModel.getPixelPosition(min).mul(pixelSize);
            const botRight = pixelModel.getPixelPosition(max).mul(pixelSize).addX(pixelSize).addY(pixelSize);
            const color = WorldItemDefinition.getByTypeName(item.type, worldItemDefinitions).color;

            const attrs: [string, string][] = [
                ['x', `${topLeft.x}px`],
                ['y', `${topLeft.y}px`],
                ['width', `${botRight.x - topLeft.x}px`],
                ['height', `${botRight.y - topLeft.y}px`],
                ['fill', item.tags.includes(PixelTag.SELECTED) ? 'blue' : color],
                ['data-wg-x', topLeft.x + ''],
                ['data-wg-y', topLeft.y + ''],
                ['data-wg-width',  `${botRight.x - topLeft.x}`],
                ['data-wg-height',  `${botRight.y - topLeft.y}`],
                ['data-wg-type', item.type],
                ['data-wg-shape', 'rect'],
                ['data-wg-color', item.color]
            ];

            return this.createTag('rect', attrs);
        });
    }

    private createMetaData(worldItemDefinitions: WorldItemDefinition[]): string {
        const wgTypeComponents = worldItemDefinitions.map(type => {
            const attributes: [string, string][] = [
                ['color', type.color],
                ['scale', type.scale ? type.scale + '' : '1'],
                ['translate-y', type.translateY ? type.translateY + '' : '0'],
                ['type-name', type.typeName],
                ['shape', type.shape]
            ]

            if (type.model) {
                attributes.push(['model', type.model]);
            }

            if (type.materials) {
                attributes.push(['materials', type.materials.join(' ')]);
            }

            if (type.roles && type.roles.length > 0) {
                attributes.push(['roles', type.roles.join(' ')]);
            }

            return this.createTag('wg-type', attributes);
        });

        return this.createTag('metadata', [], wgTypeComponents.join(''));
    }

    private createTag(tagName: string, attributes: [string, string][], content: string = ''): string {
        const attrs = attributes.map(attr => `${attr[0]}="${attr[1]}"`); 

        return `<${tagName} ${attrs.join(' ')}>${content}</${tagName}>`;
    }
}