import { SvgConfigReader } from '../../../../world_generator/importers/svg/SvgConfigReader';
import { SvgPreprocessor } from '../../../../world_generator/importers/svg/SvgPreprocessor';
import { ICanvasImporter } from '../ICanvasImporter';
import { SvgCanvasController } from './SvgCanvasController';
import { EventDispatcher } from '../../events/EventDispatcher';
import { Events } from '../../events/Events';
import { WorldItemShape } from '../../../../world_generator/services/GameObject';
import { Rectangle } from '../../../../model/geometry/shapes/Rectangle';
import { Point } from '../../../../model/geometry/shapes/Point';
import { CanvasItem } from './models/CanvasItem';

export class SvgCanvasImporter implements ICanvasImporter {
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

    import(file: string): void {
        const processedJson = this.svgPreprocessor.process(file); 
        this.svgCanvasController.pixelModel.clear();
        const canvasItems = processedJson.rects.map(rect => {
            const rectangle = new Rectangle(new Point(rect.x, rect.y), new Point(rect.x + rect.width, rect.y + rect.height));

            const canvasItem: CanvasItem = {
                color: 'grey',
                dimensions: rectangle,
                type: rect.type,
                layer: 0,
                isPreview: false,
                tags: new Set(),
                shape: <WorldItemShape> rect.shape,
                model: rect.model,
                rotation: rect.rotation,
                scale: 1
            }

            this.svgCanvasController.pixelModel.addRect(canvasItem);
            return canvasItem;
        });

        const {gameObjectTemplates} = this.svgConfigReader.read(file);

        this.svgCanvasController.worldItemDefinitions = gameObjectTemplates;

        canvasItems.filter(item => item.model).forEach(item => this.svgCanvasController.model3dController.set3dModelForCanvasItem(item));

        this.svgCanvasController.renderCanvas();
        this.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
        
    }
}