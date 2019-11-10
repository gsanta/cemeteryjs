import { WorldMapGraph } from '../../../WorldMapGraph';
import * as convert from 'xml-js';
import { WorldMapReader } from '../WorldMapReader';
import { minBy, maxBy } from '../../utils/Functions';
import { Point } from '@nightshifts.inc/geometry';
import { RawWorldMapJson, ProcessedWorldMapJson, Rect } from './WorldMapJson';

export class SvgWorldMapReader implements WorldMapReader {
    private removeEmptyFrame: boolean;

    constructor(removeEmptyFrame = false) {
        this.removeEmptyFrame = removeEmptyFrame;
    }

    read(svg: string): WorldMapGraph {
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(svg, {compact: true, spaces: 4}));
        const processedJson = this.processRawJson(rawJson); 

        if (this.removeEmptyFrame) {
            this.removeFrame(processedJson);
        }

        const graph = new WorldMapGraph(processedJson.width, processedJson.height);
        processedJson.rects.forEach(rect => graph.addVertex(rect.y * processedJson.width + rect.x, rect.type));

        return graph;
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

    private removeFrame(processedJson: ProcessedWorldMapJson) {
        const topLeftPoint = this.getTopLeftPoint(processedJson);
        const bottomRightPoint = this.getBottomRightPoint(processedJson);

        processedJson.width = bottomRightPoint.x - topLeftPoint.x + 1;
        processedJson.height = bottomRightPoint.y - topLeftPoint.y + 1;

        processedJson.rects.forEach(rect => {
            rect.x -= topLeftPoint.x;
            rect.y -= topLeftPoint.y;
        });
    }

    private getTopLeftPoint(processedJson: ProcessedWorldMapJson) {
        const minX = minBy<Rect>(processedJson.rects, (rect1, rect2) => rect1.x - rect2.x).x;
        const minY = minBy<Rect>(processedJson.rects, (rect1, rect2) => rect1.y - rect2.y).y;

        return new Point(minX, minY);
    }

    private getBottomRightPoint(processedJson: ProcessedWorldMapJson) {
        const maxX = maxBy<Rect>(processedJson.rects, (rect1, rect2) => rect1.x - rect2.x).x;
        const maxY = maxBy<Rect>(processedJson.rects, (rect1, rect2) => rect1.y - rect2.y).y;

        return new Point(maxX, maxY);
    }
}