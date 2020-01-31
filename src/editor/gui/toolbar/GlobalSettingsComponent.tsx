import * as React from 'react';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { AppContext, AppContextType } from '../Context';
import { DisplayEditorIconComponent } from '../icons/DisplayEditorIconComponent';
import { ExportFileIconComponent } from '../icons/ExportFileIconComponent';
import { ImportFileIconComponent } from '../icons/ImportFileIconComponent';

export interface GlobalSettingsComponentProps {
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
    canvasController: SvgCanvasController
}

export class GlobalSettingsComponent extends React.Component<GlobalSettingsComponentProps> {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        return (
            <div>
                <DisplayEditorIconComponent canvasController={this.context.controllers.svgCanvasController}/>
                <DisplayEditorIconComponent canvasController={this.context.controllers.webglCanvasController}/>
                <ImportFileIconComponent onUpload={(file) => this.context.controllers.svgCanvasController.writer.import(file)}/>
                <ExportFileIconComponent canvasController={this.context.controllers.svgCanvasController}/>
            </div>
        )
    }
}