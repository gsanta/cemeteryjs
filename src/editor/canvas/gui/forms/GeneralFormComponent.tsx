import * as React from 'react';
import { AppContext, AppContextType } from '../../../gui/Context';
import { DisplayEditorIconComponent } from '../../../gui/icons/tools/DisplayEditorIconComponent';
import { ExportFileIconComponent } from '../../../gui/icons/tools/ExportFileIconComponent';
import { ConnectedFileUploadComponent } from '../../../gui/icons/tools/ImportFileIconComponent';
import { GlobalSettingsPropType } from '../../forms/GlobalSettingsForm';
import { saveAs } from 'file-saver';
import { CanvasWindow } from '../../CanvasWindow';
import { Editor } from '../../../Editor';

export interface GeneralFormComponentProps {
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
    editor: Editor;
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
                <DisplayEditorIconComponent name="2D View" format="long" onClick={() => this.toggleWindowVisibility('canvas')} isActive={this.isVisible('canvas')}/>
                <DisplayEditorIconComponent name="3D View" format="long" onClick={() => this.toggleWindowVisibility('renderer')} isActive={this.isVisible('renderer')}/>
                <ConnectedFileUploadComponent propertyName={GlobalSettingsPropType.IMPORT_FILE} formController={form} placeholder={'Import file'} readDataAs="text"/>
                <ExportFileIconComponent format="long" onClick={() => this.exportFile()} isActive={false}/>
            </div>
        )
    }

    private isVisible(controllerName: string) {
        return this.props.editor.getWindowControllerByName(controllerName).isVisible();
    }

    private exportFile() {
        const canvasController = this.props.editor.getWindowControllerByName('canvas') as CanvasWindow;
        const file = canvasController.exporter.export();
        var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "dynamic.txt");
    }

    private toggleWindowVisibility(name: string) {
        this.props.editor.setWindowVisibility(name, !this.props.editor.getWindowControllerByName(name).isVisible());
    }
}