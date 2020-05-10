import * as React from 'react';
import { PauseIconComponent } from '../../../core/gui/icons/PauseIconComponent';
import { PlayIconComponent } from '../../../core/gui/icons/PlayIconComponent';
import { StopIconComponent } from '../../../core/gui/icons/StopIconComponent';
import { AccordionComponent } from '../../../core/gui/misc/AccordionComponent';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ActionNodeSettingsProps } from './actionNodeSettingsFactory';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { ActionEditorSettingsProps } from './ActionEditorSettings';

export class KeyboardActionNodeSettingsComponent extends React.Component<ActionNodeSettingsProps> {
    static contextType = AppContext;
    context: AppContextType;


    render() {
        return (
            <div>
                {this.renderKeyboardKeysDropdown()}
            </div>
        )
    }

    private renderKeyboardKeysDropdown() {
        debugger;
        const keys: string[] = this.props.settings.getVal(ActionEditorSettingsProps.AllKeyboardKeys);
        const val: string = this.props.settings.getVal(ActionEditorSettingsProps.KeyboardKey);

        return (
            <ConnectedDropdownComponent
                formController={this.props.settings}
                propertyName={ActionEditorSettingsProps.KeyboardKey}
                values={keys}
                currentValue={val}
                placeholder="Select path"
            />
        )
    }
}