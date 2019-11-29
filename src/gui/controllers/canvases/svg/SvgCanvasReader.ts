import { SvgCanvasController } from './SvgCanvasController';
import { WorldItemDefinitionModel } from '../../world_items/WorldItemDefinitionModel';
import { ICanvasReader } from '../ICanvasReader';
import { WorldItemDefinition } from '../../../../WorldItemDefinition';

export class SvgCanvasReader implements ICanvasReader {
    private bitmapEditorController: SvgCanvasController;

    constructor(bitmapEditorController: SvgCanvasController) {
        this.bitmapEditorController = bitmapEditorController;
    }

    read(): string {
        const metaData = this.createMetaData(this.bitmapEditorController.worldItemDefinitions);
        const shapes = this.createPixels(this.bitmapEditorController.worldItemDefinitions);

        return `<svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000">${metaData}${shapes.join('')}</svg>`;
    }

    private createPixels(worldItemDefinitions: WorldItemDefinition[]): string[] {
        const pixelModel = this.bitmapEditorController.pixelModel;
        const configModel = this.bitmapEditorController.configModel;

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
                    ['fill', color],
                    ['data-wg-x', pos.x + ''],
                    ['data-wg-y', pos.y + ''],
                    ['data-wg-type', pixel.type]
                ];
                
                elements.push(this.createTag('rect', attrs));
            });
        });

        return elements;
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