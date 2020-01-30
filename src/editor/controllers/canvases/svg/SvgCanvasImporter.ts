import { ICanvasImporter } from '../ICanvasImporter';
import { SvgCanvasController } from './SvgCanvasController';
import { EventDispatcher } from '../../events/EventDispatcher';
import { Events } from '../../events/Events';
import * as convert from 'xml-js';
import { RawWorldMapJson } from '../../../../world_generator/importers/svg/WorldMapJson';
import { ToolType } from './tools/Tool';

export class SvgCanvasImporter implements ICanvasImporter {
    private canvasController: SvgCanvasController;
    private eventDispatcher: EventDispatcher;

    constructor(svgCanvasController: SvgCanvasController, eventDispatcher: EventDispatcher) {
        this.canvasController = svgCanvasController;
        this.eventDispatcher = eventDispatcher;
    }

    import(file: string): void {
        this.canvasController.canvasStore.clear();
        
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(file, {compact: true, spaces: 4}));
        const toolGroups = rawJson.svg.g.length ? rawJson.svg.g : [rawJson.svg.g];

        toolGroups.forEach(toolGroup => {
            const toolType: ToolType = <ToolType> toolGroup._attributes["data-tool-type"];
            this.canvasController.toolService.getToolImporter(toolType).import(toolGroup)

        });

        this.canvasController.canvasStore.items.filter(item => item.modelPath).forEach(item => this.canvasController.model3dController.set3dModelForCanvasItem(item));

        this.canvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
        
    }
}