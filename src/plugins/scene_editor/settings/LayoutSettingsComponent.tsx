import * as React from 'react';
import { Editor } from '../../../core/Editor';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { LabelColumnStyled, MultiFieldColumnStyled, LabeledField } from './SettingsComponent';
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
        return (
            <div>
                {this.renderLayoutDropdown()}
            </div>
        )
    }

    private renderLayoutDropdown(): JSX.Element {
        return (
            <LabeledField>
                <LabelColumnStyled>Layout</LabelColumnStyled>
                <MultiFieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.context.controllers.layoutSettings}
                        propertyName={LayoutPropType.Layout}
                        values={this.context.registry.plugins.predefinedLayouts.map(layout => layout.title)}
                        currentValue={this.context.registry.plugins.getCurrentPredefinedLayout().title}
                        placeholder="Select layout"
                    />
                </MultiFieldColumnStyled>
            </LabeledField>
        );
    }
}