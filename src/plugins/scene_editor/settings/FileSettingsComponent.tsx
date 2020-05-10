import { saveAs } from 'file-saver';
import * as React from 'react';
import { Editor } from '../../../editor/Editor';
import { AppContext, AppContextType } from '../../../editor/gui/Context';
import { BlankIconComponent } from '../../../editor/gui/icons/tools/BlankIconComponent';
import { ExportFileIconComponent } from '../../../editor/gui/icons/tools/ExportFileIconComponent';
import { ConnectedFileUploadComponent } from '../../../editor/gui/icons/tools/ImportFileIconComponent';
import { colors } from '../../../editor/gui/styles';
import { GlobalSettingsPropType } from './GlobalSettings';

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
        const file = this.context.registry.services.export.export();
        var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "dynamic.txt");
    }

    private blank() {
        this.context.registry.services.tools.delete.eraseAll();
    }
}