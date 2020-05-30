import * as React from 'react';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { FieldColumnStyled, LabelColumnStyled, SettingsRowStyled } from '../../scene_editor/settings/SettingsComponent';
import { KeyboardInputNodeProps } from './nodes/KeyboardNodeSettings';
import { AbstractNodeSettingsComponent } from './AbstractNodeSettingsComponent';

export class KeyboardNodeSettingsComponent extends AbstractNodeSettingsComponent {

    render() {
        return (
            <div>
                {this.renderSlots()}
                {this.renderKeyboardKeysDropdown()}
            </div>
        )
    }

    private renderKeyboardKeysDropdown() {
        const keys: string[] = this.props.settings.getVal(KeyboardInputNodeProps.AllKeyboardKeys);
        const val: string = this.props.settings.getVal(KeyboardInputNodeProps.KeyboardKey);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled className="input-label">Key</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={KeyboardInputNodeProps.KeyboardKey}
                        values={keys}
                        currentValue={val}
                        placeholder="Select key"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        )
    }
}