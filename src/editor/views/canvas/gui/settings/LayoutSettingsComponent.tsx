import * as React from 'react';
import { Editor } from '../../../../Editor';
import { AppContext, AppContextType } from '../../../../gui/Context';
import { ConnectedDropdownComponent } from '../../../../gui/inputs/DropdownComponent';
import { LayoutPropType } from '../../settings/LayoutSettings';
import { LabelColumnStyled, MultiFieldColumnStyled, SettingsRowStyled } from './SettingsComponent';

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
        const viewService = this.context.registry.services.view;

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