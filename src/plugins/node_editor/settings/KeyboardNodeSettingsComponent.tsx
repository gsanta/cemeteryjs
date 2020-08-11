import * as React from 'react';
import { ConnectedDropdownComponent } from '../../../core/ui_regions/components/inputs/DropdownComponent';
import { FieldColumnStyled, LabelColumnStyled, LabeledField } from '../../scene_editor/settings/SettingsComponent';
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
            <LabeledField>
                <LabelColumnStyled className="input-label">Key</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={KeyboardInputNodeProps.KeyboardKey}
                        values={keys}
                        currentValue={val}
                        placeholder="Select key"
                        onChange={val => this.props.settings.updateProp(val, KeyboardInputNodeProps.KeyboardKey)}
                    />
                </FieldColumnStyled>
            </LabeledField>
        )
    }
}