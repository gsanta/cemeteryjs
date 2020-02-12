import * as React from 'react';
import { AppContext, AppContextType } from '../Context';
import { DisplayEditorIconComponent } from '../icons/tools/DisplayEditorIconComponent';
import { ExportFileIconComponent } from '../icons/tools/ExportFileIconComponent';
import { ConnectedFileUploadComponent } from '../icons/tools/ImportFileIconComponent';
import { GlobalSettingsPropType } from '../../controllers/forms/GlobalSettingsForm';
import { saveAs } from 'file-saver';

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