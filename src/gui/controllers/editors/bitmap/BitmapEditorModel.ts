import { IEditorModel } from "../IEditorModel";
import { FileFormat } from "../../../../WorldGenerator";
import { WorldItemDefinition } from "../../../../WorldItemDefinition";
import { WgDefinitionAttributes } from "../../../../model/readers/svg/WorldMapJson";
import { PixelModel } from './PixelModel';
import { BitmapConfig } from './BitmapConfig';
import { WorldItemDefinitionModel } from '../../world_items/WorldItemDefinitionModel';

export class BitmapEditorModel implements IEditorModel {
    config: BitmapConfig;
    pixels: PixelModel;

    constructor() {
        this.config = new BitmapConfig();
        this.pixels = new PixelModel(this.config);
    }

    getFileFormat(): FileFormat {
        return FileFormat.TEXT;
    }

    getFile(worldItemDefinitionModel: WorldItemDefinitionModel): string {
        const metaData = this.createMetaData(worldItemDefinitionModel);
        const shapes = this.createShapes(worldItemDefinitionModel);

        return `${metaData}\n${shapes}`;
    }

    private createShapes(worldItemDefinitionModel: WorldItemDefinitionModel): string[] {

        return Array.from(this.pixels.bitMap).map(([index, pixel]) => {
            const pixelSize = this.config.pixelSize;
            const pos = this.pixels.getPixelPosition(index).mul(pixelSize);
            const color = worldItemDefinitionModel.getByTypeName(pixel.type).color;

            const attrs: [string, string][] = [
                ['width', '10px'],
                ['height', '10px'],
                ['x', `${pos.x}px`],
                ['y', `${pos.y}px`],
                ['fill', color],
                ['data-wg-x', pos.x + ''],
                ['data-wg-y', pos.y + ''],
                ['data-wg-type', pixel.type]
            ]

            return this.createTag('rect', attrs);
        })
    }


    private createMetaData(worldItemDefinitionModel: WorldItemDefinitionModel): string {
        const wgTypeComponents = worldItemDefinitionModel.types.map(type => {
            const attributes: [string, string][] = [
                ['color', type.color],
                ['is-border', type.isBorder ? 'true' : 'false'],
                ['scale', type.scale ? type.scale + '' : '1'],
                ['translate-y', type.translateY ? type.translateY + '' : '0'],
                ['type-name', type.typeName]
            ]

            if (type.model) {
                attributes.push(['model', type.model]);
            }

            if (type.materials) {
                attributes.push(['materials', type.materials.join(' ')]);
            }

            return this.createTag('wg-type', attributes);
        });

        return this.createTag('metadata', [], wgTypeComponents.join('/n'));
    }

    private createTag(tagName: string, attributes: [string, string][], content: string = ''): string {
        const attrs = attributes.map(attr => `${attr[0]}="${attr[1]}"`); 

        return `<${tagName} ${attrs.join(' ')}>${content}</${tagName}>`;
    }
}