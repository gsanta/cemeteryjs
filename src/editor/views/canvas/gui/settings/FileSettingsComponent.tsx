import * as React from 'react';
import { AppContext, AppContextType } from '../../../../gui/Context';
import { ExportFileIconComponent } from '../../../../gui/icons/tools/ExportFileIconComponent';
import { ConnectedFileUploadComponent } from '../../../../gui/icons/tools/ImportFileIconComponent';
import { GlobalSettingsPropType } from '../../settings/GlobalSettings';
import { saveAs } from 'file-saver';
import { Editor } from '../../../../Editor';
import { BlankIconComponent } from '../../../../gui/icons/tools/BlankIconComponent';
import { DeleteTool } from '../../tools/DeleteTool';
import { ToolType } from '../../tools/Tool';
import { colors } from '../../../../gui/styles';
import { CanvasView } from '../../CanvasView';

export interface GeneralFormComponentProps {
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
    editor: Editor;
}

export class FileSettingsComponent extends React.Component<GeneralFormComponentProps> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.controllers.globalSettingsForm.setRenderer(() => this.forceUpdate());
    }

    render() {
        const form = this.context.controllers.globalSettingsForm;

        return (
            <div>
                <ConnectedFileUploadComponent propertyName={GlobalSettingsPropType.IMPORT_FILE} formController={form} placeholder={'Import file'} readDataAs="text"/>
                <ExportFileIconComponent format="long" onClick={() => this.exportFile()} isActive={false}/>
                <BlankIconComponent format="long" color={colors.danger} isActive={false} onClick={() => this.blank()}/>
            </div>
        )
    }

    private exportFile() {
        const file = this.context.getServices().exportService().export();
        var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "dynamic.txt");
    }

    private blank() {
        this.context.getStores().viewStore.getViewById(CanvasView.id).getToolByType<DeleteTool>(ToolType.DELETE).eraseAll();
    }
}