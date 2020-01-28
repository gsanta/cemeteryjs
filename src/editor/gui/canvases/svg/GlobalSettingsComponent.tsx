import * as React from 'react';
import { SvgCanvasController } from '../../../controllers/canvases/svg/SvgCanvasController';
import { ImportFileIconComponent } from '../../icons/ImportFileIconComponent';
import { ButtonComponent } from '../../forms/ButtonComponent';
import { ExportFileIconComponent } from '../../icons/ExportFileIconComponent';


export class GlobalSettingsComponent extends React.Component<{canvasController: SvgCanvasController}> {

    render() {
        return (
            <div>
                <ImportFileIconComponent onUpload={(file) => this.context.controllers.svgCanvasController.writer.import(file)}/>
                <ExportFileIconComponent/>
            </div>
        )
    }

    private saveFile() {
        const file = this.context.controllers.svgCanvasController.reader.export();
        var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "dynamic.txt");
    }
}