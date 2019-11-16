import { Point } from '@nightshifts.inc/geometry';
import { SvgConfigReader } from '../../../../model/readers/svg/SvgConfigReader';
import { SvgPreprocessor } from '../../../../model/readers/svg/SvgPreprocessor';
import { FileFormat } from '../../../../WorldGenerator';
import { ICanvasWriter } from '../ICanvasWriter';
import { SvgCanvasController } from './SvgCanvasController';
import { EventDispatcher } from '../../events/EventDispatcher';
import { Events } from '../../events/Events';

export class SvgCanvasWriter implements ICanvasWriter {
    private svgCanvasController: SvgCanvasController;
    private svgPreprocessor: SvgPreprocessor;
    private svgConfigReader: SvgConfigReader;
    private eventDispatcher: EventDispatcher;

    constructor(svgCanvasController: SvgCanvasController, eventDispatcher: EventDispatcher) {
        this.svgCanvasController = svgCanvasController;
        this.eventDispatcher = eventDispatcher;
        this.svgPreprocessor = new SvgPreprocessor();
        this.svgConfigReader = new SvgConfigReader();
    }

    write(file: string, fileFormat: FileFormat): void {
        if (fileFormat !== FileFormat.SVG) {
            throw new Error('BitmapEditorWriter only supports svg file format.');
        }

        const processedJson = this.svgPreprocessor.process(file); 
        const pixelSize = processedJson.pixelSize;
        this.svgCanvasController.pixelModel.clear();
        processedJson.rects.forEach(rect => this.svgCanvasController.pixelModel.addPixel(new Point(rect.x * pixelSize, rect.y * pixelSize), rect.type, false));

        const {worldItemTypes} = this.svgConfigReader.read(file);

        this.svgCanvasController.worldItemDefinitionModel.setTypes(worldItemTypes);
        this.svgCanvasController.render();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }
}