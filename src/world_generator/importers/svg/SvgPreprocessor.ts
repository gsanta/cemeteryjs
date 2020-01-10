import { ProcessedWorldMapJson, RawWorldMapJson, Rect } from "./WorldMapJson";
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

        processedJson.rects = this.processRects(rawJson);

        return processedJson;
    }

    processRects(rawJson: RawWorldMapJson): Rect[] {
        if (!rawJson.svg.rect) { return []; }

        if (!Array.isArray(rawJson.svg.rect)) {
            rawJson.svg.rect = [rawJson.svg.rect];
        }

        const pixelSize = parseInt(rawJson.svg._attributes["data-wg-pixel-size"], 10);
        
        return rawJson.svg.rect.map(rect => {
            const type = rect._attributes["data-wg-type"];
            const x = parseInt(rect._attributes["data-wg-x"], 10) / pixelSize;
            const y = parseInt(rect._attributes["data-wg-y"], 10) / pixelSize;
            const width = parseInt(rect._attributes["data-wg-width"], 10) / pixelSize;
            const height = parseInt(rect._attributes["data-wg-height"], 10) / pixelSize;
            const shape = rect._attributes["data-wg-shape"];
            const color = rect._attributes["data-wg-color"];
            const model = rect._attributes["data-wg-model"];
            const rotation = parseInt(rect._attributes["data-rotation"], 10);
            const scale = parseFloat(rect._attributes["data-wg-scale"]);
            const name = rect._attributes["data-wg-name"];

            return {
                x,
                y,
                width,
                height,
                type,
                shape,
                color,
                model,
                rotation,
                scale,
                name
            };
        });
    }
}