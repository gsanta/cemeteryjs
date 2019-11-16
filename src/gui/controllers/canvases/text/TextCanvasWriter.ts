import { TextConfigReader } from '../../../../model/readers/text/TextConfigReader';
import { TextWorldMapParser, WorldMapLineListener } from '../../../../model/readers/text/TextWorldMapParser';
import { FileFormat } from '../../../../WorldGenerator';
import { ICanvasWriter } from '../ICanvasWriter';
import { TextCanvasController } from './TextCanvasController';


export class TextCanvasWriter implements ICanvasWriter {
    private textCanvasController: TextCanvasController;
    private textConfigReader: TextConfigReader;

    constructor(textEditorController: TextCanvasController) {
        this.textCanvasController = textEditorController;
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

        this.textCanvasController.worldItemDefinitionModel.setTypes(worldItemTypes);
        this.textCanvasController.setRendererDirty();
        this.textCanvasController.setText(lines.join('\n'));
    }
}