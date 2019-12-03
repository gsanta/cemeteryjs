import { Point } from '@nightshifts.inc/geometry';
import { WorldMapGraph } from '../../../WorldMapGraph';
import { maxBy, minBy } from '../../utils/Functions';
import { WorldMapReader } from '../WorldMapReader';
import { SvgPreprocessor } from './SvgPreprocessor';
import { ProcessedWorldMapJson, Rect } from './WorldMapJson';

export class SvgWorldMapReader implements WorldMapReader {
    private removeEmptyFrame: boolean;
    private svgPreprocessor: SvgPreprocessor;

    constructor(removeEmptyFrame = false) {
        this.removeEmptyFrame = removeEmptyFrame;
        this.svgPreprocessor = new SvgPreprocessor();
    }

    read(svg: string): WorldMapGraph {
        const processedJson = this.svgPreprocessor.process(svg);

        if (processedJson.rects.length === 0) {
            return new WorldMapGraph(processedJson.width, processedJson.height);
        }

        if (this.removeEmptyFrame) {
            this.removeFrame(processedJson);
        }

        const graph = new WorldMapGraph(processedJson.width, processedJson.height);

        processedJson.rects.forEach(rect => this.addRect(rect, processedJson, graph));

        return graph;
    }

    private addRect(rect: Rect, processedJson: ProcessedWorldMapJson, graph: WorldMapGraph) {
        for (let x = rect.x; x < rect.x + rect.width; x++) {
            for (let y = rect.y; y < rect.y + rect.height; y++) {
                graph.addNode(y * processedJson.width + x, rect.type);
            }
        }
    }

    private removeFrame(processedJson: ProcessedWorldMapJson) {
        const topLeftPoint = this.getTopLeftPoint(processedJson);
        const bottomRightPoint = this.getBottomRightPoint(processedJson);

        processedJson.width = bottomRightPoint.x - topLeftPoint.x;
        processedJson.height = bottomRightPoint.y - topLeftPoint.y;

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
        const maxX = maxBy<Rect>(processedJson.rects, (rect1, rect2) => (rect1.x + rect1.width) - (rect2.x + rect2.width));
        const maxY = maxBy<Rect>(processedJson.rects, (rect1, rect2) => (rect1.y + rect1.height) - (rect2.y + rect2.height));

        return new Point(maxX.x + maxX.width, maxY.y + maxY.height);
    }
}