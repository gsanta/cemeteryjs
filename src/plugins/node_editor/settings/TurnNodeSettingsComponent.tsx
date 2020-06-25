import * as React from 'react';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { FieldColumnStyled, LabelColumnStyled, LabeledField } from '../../scene_editor/settings/SettingsComponent';
import { AbstractNodeSettingsComponent } from './AbstractNodeSettingsComponent';
import { MoveNodeProps } from './nodes/MoveNodeSettings';
import { TurnNodeProps } from './nodes/TurnNodeSettings';

export class TurnNodeSettingsComponent extends  AbstractNodeSettingsComponent {
    render() {
        return (
            <div>
                {this.renderSlots()}
                {this.renderMoveDirectionDropdown()}
            </div>
        )
    }

    private renderMoveDirectionDropdown() {
        const movementTypes: string[] = this.props.settings.getVal(TurnNodeProps.AllTurns);
        const val: string = this.props.settings.getVal(TurnNodeProps.Turn);

        return (
            <LabeledField>
                <LabelColumnStyled className="input-label">Action</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={TurnNodeProps.Turn}
                        values={movementTypes}
                        currentValue={val}
                        placeholder="Select Turn"
                    />
                </FieldColumnStyled>
            </LabeledField>
        );
    }
}