import * as React from 'react';
import { AppContext, AppContextType } from '../../../gui/Context';
import { DisplayEditorIconComponent } from '../../../gui/icons/tools/DisplayEditorIconComponent';
import { ExportFileIconComponent } from '../../../gui/icons/tools/ExportFileIconComponent';
import { ConnectedFileUploadComponent } from '../../../gui/icons/tools/ImportFileIconComponent';
import { GlobalSettingsPropType } from '../../forms/GlobalSettingsForm';
import { saveAs } from 'file-saver';

export interface GeneralFormComponentProps {
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
}

export class GeneralFormComponent extends React.Component<GeneralFormComponentProps> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.controllers.globalSettingsForm.setRenderer(() => this.forceUpdate());
    }

    render() {
        const form = this.context.controllers.globalSettingsForm;

        return (
            <div>
                <DisplayEditorIconComponent name="2D View" format="long" onClick={() => this.toggleCanvasVisibility()} isActive={this.context.controllers.svgCanvasController.isVisible()}/>
                <DisplayEditorIconComponent name="3D View" format="long" onClick={() => this.toggleWebglVisibility()} isActive={this.context.controllers.webglCanvasController.isVisible()}/>
                <ConnectedFileUploadComponent propertyName={GlobalSettingsPropType.IMPORT_FILE} formController={form} placeholder={'Import file'} readDataAs="text"/>
                <ExportFileIconComponent format="long" onClick={() => this.exportFile()} isActive={false}/>
            </div>
        )
    }

    private exportFile() {
        const file = this.context.controllers.svgCanvasController.reader.export();
        var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "dynamic.txt");
    }

    private toggleCanvasVisibility() {
        this.context.controllers.svgCanvasController.setVisible(!this.context.controllers.svgCanvasController.isVisible())
    }

    private toggleWebglVisibility() {
        this.context.controllers.webglCanvasController.setVisible(!this.context.controllers.webglCanvasController.isVisible())
    }
}