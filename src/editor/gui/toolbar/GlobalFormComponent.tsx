import * as React from 'react';
import { AppContext, AppContextType } from '../Context';
import { DisplayEditorIconComponent } from '../icons/tools/DisplayEditorIconComponent';
import { ExportFileIconComponent } from '../icons/tools/ExportFileIconComponent';
import { ConnectedFileUploadComponent } from '../icons/tools/ImportFileIconComponent';
import { GlobalSettingsPropType } from '../../controllers/forms/GlobalSettingsForm';

export interface GlobalFormComponentProps {
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
}

export class GlobalFormComponent extends React.Component<GlobalFormComponentProps> {
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
                <ConnectedFileUploadComponent propertyName={GlobalSettingsPropType.IMPORT_FILE} formController={form} placeholder={'Import file'} readDataAs="text"/>
                <ExportFileIconComponent canvasController={this.context.controllers.svgCanvasController}/>
            </div>
        )
    }
}