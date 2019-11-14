import { SvgEditorController } from './SvgEditorController';
import { SvgPreprocessor } from '../../../../model/readers/svg/SvgPreprocessor';
import { Point } from '@nightshifts.inc/geometry';
import { WorldItemDefinitionModel } from '../../world_items/WorldItemDefinitionModel';
import { SvgConfigReader } from '../../../../model/readers/svg/SvgConfigReader';
import { IEditorWriter } from '../IEditorWriter';
import { FileFormat } from '../../../../WorldGenerator';

export class SvgEditorWriter implements IEditorWriter {
    private bitmapEditor: SvgEditorController;
    private worldItemDefinitionModel: WorldItemDefinitionModel;
    private svgPreprocessor: SvgPreprocessor;
    private svgConfigReader: SvgConfigReader;

    constructor(bitmapEditor: SvgEditorController, worldItemDefinitionModel: WorldItemDefinitionModel) {
        this.bitmapEditor = bitmapEditor;
        this.worldItemDefinitionModel = worldItemDefinitionModel;
        this.svgPreprocessor = new SvgPreprocessor();
        this.svgConfigReader = new SvgConfigReader();
    }

    write(file: string, fileFormat: FileFormat): void {
        if (fileFormat !== FileFormat.SVG) {
            throw new Error('BitmapEditorWriter only supports svg file format.');
        }

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