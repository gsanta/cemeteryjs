import * as React from 'react';
import { Editor } from '../../../core/Editor';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { LabelColumnStyled, MultiFieldColumnStyled, SettingsRowStyled } from './SettingsComponent';
import { LayoutPropType } from './LayoutSettings';
import { AppContext, AppContextType } from '../../../core/gui/Context';

export interface GeneralFormComponentProps {
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
    editor: Editor;
}

export class LayoutSettingsComponent extends React.Component<GeneralFormComponentProps> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.controllers.globalSettingsForm.setRenderer(() => this.forceUpdate());
    }

    render() {
        const form = this.context.controllers.globalSettingsForm;

        return (
            <div>
                {this.renderLayoutDropdown()}
            </div>
        )
    }

    private renderLayoutDropdown(): JSX.Element {
        const layoutSettings = this.context.controllers.layoutSettings;
        const viewService = this.context.registry.services.layout;

        return (
            <SettingsRowStyled>
                <LabelColumnStyled>Layout</LabelColumnStyled>
                <MultiFieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={layoutSettings}
                        propertyName={LayoutPropType.Layout}
                        values={viewService.layouts.map(layout => layout.name)}
                        currentValue={viewService.activeLayout.name}
                        placeholder="Select layout"
                    />
                </MultiFieldColumnStyled>
            </SettingsRowStyled>
        );
    }
}