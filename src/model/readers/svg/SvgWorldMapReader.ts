import { WorldMapGraph } from '../../parsers/WorldMapGraph';
import * as convert from 'xml-js';

interface WorldMapJson {
    svg: {
        _attributes: {
            "wg:width": string;
            "wg:height": string;
        }
        rect: {
            _attributes: {
                "wg:x": string,
                "wg:y": string,
                "wg:type": string
            }
        }[]
    }
} 

export class SvgWorldMapReader {


    read(svg: string): WorldMapGraph {
        const json: WorldMapJson = JSON.parse(convert.xml2json(svg, {compact: true, spaces: 4}));
        const width = parseInt(json.svg._attributes["wg:width"], 10);
        const height = parseInt(json.svg._attributes["wg:height"], 10);

        const graph = new WorldMapGraph(width, height);

        json.svg.rect.forEach(rect => {
            const type = rect._attributes["wg:type"];
            const x = parseInt(rect._attributes["wg:x"], 10);
            const y = parseInt(rect._attributes["wg:y"], 10);

            graph.addVertex(y * width + x, type);
        });

        return graph;
    }
}