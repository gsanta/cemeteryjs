import { WorldMapGraph } from '../../parsers/WorldMapGraph';
import * as convert from 'xml-js';

interface WorldMapJson {
    svg: {
        _attributes: {
            "data-wg-width": string;
            "data-wg-height": string;
        }
        rect: {
            _attributes: {
                "data-wg-x": string,
                "data-wg-y": string,
                "data-wg-type": string
            }
        }[]
    }
} 

export class SvgWorldMapReader {


    read(svg: string): WorldMapGraph {
        const json: WorldMapJson = JSON.parse(convert.xml2json(svg, {compact: true, spaces: 4}));
        const width = parseInt(json.svg._attributes["data-wg-width"], 10);
        const height = parseInt(json.svg._attributes["data-wg-height"], 10);
        const pixelSize = parseInt(json.svg._attributes["data-wg-pixel-size"], 10);

        const graph = new WorldMapGraph(width / pixelSize, height / pixelSize);

        json.svg.rect.forEach(rect => {
            const type = rect._attributes["data-wg-type"];
            const x = parseInt(rect._attributes["data-wg-x"], 10) / pixelSize;
            const y = parseInt(rect._attributes["data-wg-y"], 10) / pixelSize;

            graph.addVertex(y * width + x, type);
        });

        return graph;
    }
}