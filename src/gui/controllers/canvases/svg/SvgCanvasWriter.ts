import { Point, Rectangle } from '@nightshifts.inc/geometry';
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
        this.svgCanvasController.pixelModel.clear();
        processedJson.rects.forEach(rect => {
            const rectangle = new Rectangle(new Point(rect.x, rect.y), new Point(rect.x + rect.width, rect.y + rect.height));
            this.svgCanvasController.pixelModel.addRect(rectangle, rect.type, 0, false);
        });

        const {gameObjectTemplates} = this.svgConfigReader.read(file);

        this.svgCanvasController.worldItemDefinitions = gameObjectTemplates;
        this.svgCanvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
        
    }
}