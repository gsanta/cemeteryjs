import { ProcessedWorldMapJson, RawWorldMapJson } from "./WorldMapJson";
import * as convert from 'xml-js';

export class SvgPreprocessor {

    process(svg: string): ProcessedWorldMapJson {
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(svg, {compact: true, spaces: 4}));
        return this.processRawJson(rawJson);
    }

    private processRawJson(rawJson: RawWorldMapJson): ProcessedWorldMapJson {
        const pixelSize = parseInt(rawJson.svg._attributes["data-wg-pixel-size"], 10);
        const width = parseInt(rawJson.svg._attributes["data-wg-width"], 10) / pixelSize;
        const height = parseInt(rawJson.svg._attributes["data-wg-height"], 10) / pixelSize;

        const processedJson: ProcessedWorldMapJson = {
            pixelSize,
            width,
            height,
            rects: []
        }

        rawJson.svg.rect.forEach(rect => {
            const type = rect._attributes["data-wg-type"];
            const x = parseInt(rect._attributes["data-wg-x"], 10) / pixelSize;
            const y = parseInt(rect._attributes["data-wg-y"], 10) / pixelSize;

            processedJson.rects.push({
                x,
                y,
                type
            });
        });

        return processedJson;
    }
}