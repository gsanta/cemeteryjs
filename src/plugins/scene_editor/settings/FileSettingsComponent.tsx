import { saveAs } from 'file-saver';
import * as React from 'react';
import { Editor } from '../../../core/Editor';
import { BlankIconComponent } from '../../common/toolbar/icons/BlankIconComponent';
import { ExportFileIconComponent } from '../../common/toolbar/icons/ExportFileIconComponent';
import { ConnectedFileUploadComponent } from '../../common/toolbar/icons/ImportFileIconComponent';
import { GlobalSettingsPropType } from './GlobalSettings';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { colors } from '../../../core/gui/styles';
import { DeleteTool } from '../../common/tools/DeleteTool';
import { ToolType } from '../../common/tools/Tool';

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
        // TODO eraseAll should not be on delete tool
        this.context.registry.plugins.sceneEditor.tools.byType<DeleteTool>(ToolType.Delete).eraseAll();
    }
}