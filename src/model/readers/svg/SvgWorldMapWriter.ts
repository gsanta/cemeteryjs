import { WorldMapGraph } from '../../../WorldMapGraph';
import { WorldItemDefinition } from '../../../WorldItemDefinition';
import { GlobalConfig } from '../text/GlobalSectionParser';
import { Point } from '@nightshifts.inc/geometry';


export class SvgWorldMapWriter {
    write(worldMapGraph: WorldMapGraph, worldItemDefinitions: WorldItemDefinition[], globalConfig: GlobalConfig): string {
        const metaData = this.createMetaData(worldItemDefinitions);
        const shapes = this.createShapes(worldMapGraph, worldItemDefinitions);

        return `<svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000">${metaData}\n${shapes}</svg>`;
    }

    private createShapes(worldMapGraph: WorldMapGraph, worldItemDefinitions: WorldItemDefinition[]): string[] {
        const worldItemDefinitionsByType: Map<string, WorldItemDefinition> = new Map();
        
        worldItemDefinitions.forEach(def => worldItemDefinitionsByType.set(def.typeName, def));

        return worldMapGraph.getAllVertices().map(vertex => {
            const pixelSize = 10;
            const pos = worldMapGraph.getVertexPositionInMatrix(vertex);
            const point = new Point(pos.x, pos.y).mul(pixelSize);
            const color = worldItemDefinitionsByType.get(worldMapGraph.getVertexValue(vertex)).color;

            const attrs: [string, string][] = [
                ['width', '10px'],
                ['height', '10px'],
                ['x', `${point.x}px`],
                ['y', `${point.y}px`],
                ['fill', color],
                ['data-wg-x', point.x + ''],
                ['data-wg-y', point.y + ''],
                ['data-wg-type', worldMapGraph.getVertexValue(vertex)]
            ]

            return this.createTag('rect', attrs);
        });
    }


    private createMetaData(worldItemDefinitions: WorldItemDefinition[]): string {
        const wgTypeComponents = worldItemDefinitions.map(type => {
            const attributes: [string, string][] = [
                ['color', type.color],
                ['is-border', type.isBorder ? 'true' : 'false'],
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

            return this.createTag('wg-type', attributes);
        });

        return this.createTag('metadata', [], wgTypeComponents.join('/n'));
    }

    private createTag(tagName: string, attributes: [string, string][], content: string = ''): string {
        const attrs = attributes.map(attr => `${attr[0]}="${attr[1]}"`); 

        return `<${tagName} ${attrs.join(' ')}>${content}</${tagName}>`;
    }
}