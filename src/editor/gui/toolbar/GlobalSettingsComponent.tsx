import * as React from 'react';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { AppContext, AppContextType } from '../Context';
import { DisplayEditorIconComponent } from '../icons/DisplayEditorIconComponent';
import { ExportFileIconComponent } from '../icons/ExportFileIconComponent';
import { ConnectedFileUploadComponent } from '../icons/ImportFileIconComponent';
import { GlobalSettingsPropType } from '../../controllers/forms/GlobalSettingsForm';

export interface GlobalSettingsComponentProps {
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
    canvasController: SvgCanvasController
}

export class GlobalSettingsComponent extends React.Component<GlobalSettingsComponentProps> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.controllers.globalSettingsForm.setRenderer(() => this.forceUpdate());
    }

    render() {
        const form = this.context.controllers.globalSettingsForm;

        return (
            <div>
                <DisplayEditorIconComponent canvasController={this.context.controllers.svgCanvasController}/>
                <DisplayEditorIconComponent canvasController={this.context.controllers.webglCanvasController}/>
                <ConnectedFileUploadComponent propertyName={GlobalSettingsPropType.IMPORT_FILE} formController={form} placeholder={'Import file'}/>
                <ExportFileIconComponent canvasController={this.context.controllers.svgCanvasController}/>
            </div>
        )
    }
}