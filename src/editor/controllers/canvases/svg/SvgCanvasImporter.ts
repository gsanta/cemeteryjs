import { ICanvasImporter } from '../ICanvasImporter';
import { SvgCanvasController } from './SvgCanvasController';
import { EventDispatcher } from '../../events/EventDispatcher';
import { Events } from '../../events/Events';
import * as convert from 'xml-js';
import { RawWorldMapJson } from '../../../../world_generator/importers/svg/WorldMapJson';

export class SvgCanvasImporter implements ICanvasImporter {
    private svgCanvasController: SvgCanvasController;
    private eventDispatcher: EventDispatcher;

    constructor(svgCanvasController: SvgCanvasController, eventDispatcher: EventDispatcher) {
        this.svgCanvasController = svgCanvasController;
        this.eventDispatcher = eventDispatcher;
    }

    import(file: string): void {
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(file, {compact: true, spaces: 4}));

        this.svgCanvasController.canvasStore.clear();
        this.svgCanvasController.toolService.getAllToolImporters().forEach(importer => importer.import(rawJson));

        this.svgCanvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
        
    }
}