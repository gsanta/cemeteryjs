import { IEditorReader } from '../IEditorReader';
import { BitmapEditorController } from './BitmapEditorController';
import { SvgPreprocessor } from '../../../../model/readers/svg/SvgPreprocessor';
import { Point } from '@nightshifts.inc/geometry';
import { WorldItemDefinitionModel } from '../../world_items/WorldItemDefinitionModel';
import { SvgConfigReader } from '../../../../model/readers/svg/SvgConfigReader';


export class BitmapEditorReader implements IEditorReader {
    private bitmapEditor: BitmapEditorController;
    private worldItemDefinitionModel: WorldItemDefinitionModel;
    private svgPreprocessor: SvgPreprocessor;
    private svgConfigReader: SvgConfigReader;

    constructor(bitmapEditor: BitmapEditorController, worldItemDefinitionModel: WorldItemDefinitionModel) {
        this.bitmapEditor = bitmapEditor;
        this.worldItemDefinitionModel = worldItemDefinitionModel;
        this.svgPreprocessor = new SvgPreprocessor();
        this.svgConfigReader = new SvgConfigReader();
    }

    read(file: string): void {
        const processedJson = this.svgPreprocessor.process(file); 
        const pixelSize = processedJson.pixelSize;
        this.bitmapEditor.pixelModel.clear();
        processedJson.rects.forEach(rect => this.bitmapEditor.pixelModel.addPixel(new Point(rect.x * pixelSize, rect.y * pixelSize), rect.type, false));

        const {worldItemTypes} = this.svgConfigReader.read(file);

        this.worldItemDefinitionModel.setTypes(worldItemTypes);
        this.bitmapEditor.setRendererDirty();
        this.bitmapEditor.updateUI();
    }
}