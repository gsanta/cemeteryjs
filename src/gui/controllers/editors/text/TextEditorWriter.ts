import { IEditorReader } from '../IEditorReader';
import { TextEditorController } from './TextEditorController';
import { WorldItemDefinitionModel } from '../../world_items/WorldItemDefinitionModel';
import { TextConfigReader } from '../../../../model/readers/text/TextConfigReader';
import { TextWorldMapParser, WorldMapLineListener } from '../../../../model/readers/text/TextWorldMapParser';
import { IEditorWriter } from '../IEditorWriter';
import { FileFormat } from '../../../../WorldGenerator';


export class TextEditorWriter implements IEditorWriter {
    private textEditorController: TextEditorController;
    private worldItemDefinitionModel: WorldItemDefinitionModel;
    private textConfigReader: TextConfigReader;

    constructor(textEditorController: TextEditorController, worldItemDefinitionModel: WorldItemDefinitionModel) {
        this.textEditorController = textEditorController;
        this.worldItemDefinitionModel = worldItemDefinitionModel;
        this.textConfigReader = new TextConfigReader();

    }

    write(file: string, fileFormat: FileFormat): void {
        if (fileFormat !== FileFormat.TEXT) {
            throw new Error('TextEditorWriter only supports text file format.');
        }

        const {worldItemTypes} = this.textConfigReader.read(file);

        const lines: string[] = [];
        new TextWorldMapParser(new class extends WorldMapLineListener {
            addMapSectionLine(line: string) {
                lines.push(line);
            }
        }).read(file);

        this.worldItemDefinitionModel.setTypes(worldItemTypes);
        this.textEditorController.setRendererDirty();
        this.textEditorController.setText(lines.join('\n'));
    }
}