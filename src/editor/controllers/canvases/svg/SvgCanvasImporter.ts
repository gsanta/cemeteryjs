import { ICanvasImporter } from '../ICanvasImporter';
import { EventDispatcher } from '../../events/EventDispatcher';
import { Events } from '../../events/Events';
import * as convert from 'xml-js';
import { RawWorldMapJson } from '../../../../world_generator/importers/svg/WorldMapJson';
import { ToolType } from './tools/Tool';
import { EditorFacade } from '../../EditorFacade';
import { ViewType } from '../../../../model/View';
import { IViewImporter } from './tools/IToolImporter';

export class SvgCanvasImporter implements ICanvasImporter {
    private viewImporters: IViewImporter[];

    constructor(viewImporters: IViewImporter[]) {
        this.viewImporters = viewImporters;
    }

    import(file: string): void {
        // this.services.viewStore.clear();
        
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(file, {compact: true, spaces: 4}));
        const toolGroups = rawJson.svg.g ? rawJson.svg.g.length ? rawJson.svg.g : [rawJson.svg.g] : [];

        toolGroups.forEach(toolGroup => {
            const viewType: ViewType = <ViewType> toolGroup._attributes["data-view-type"];
            this.findViewImporter(viewType).import(toolGroup)

        });

        // this.services.viewStore.getGameObjects().filter(item => item.modelPath).forEach(item => this.services.svgCanvasController.model3dController.set3dModelForCanvasItem(item));

        // this.services.svgCanvasController.renderCanvas();
        // this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
        
    }

    private findViewImporter(viewType: ViewType): IViewImporter {
        return this.viewImporters.find(view => view.type === viewType);
    }
}