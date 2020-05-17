import * as React from 'react';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { FieldColumnStyled, LabelColumnStyled, SettingsRowStyled } from '../../scene_editor/settings/SettingsComponent';
import { AbstractNodeSettingsComponent } from './AbstractNodeSettingsComponent';
import { MoveNodeProps } from './nodes/ActionNodeSettings';

export class ActionNodeSettingsComponent extends  AbstractNodeSettingsComponent {
    render() {
        return (
            <div>
                {this.renderSlots()}
                {this.renderMoveDirectionDropdown()}
            </div>
        )
    }

    private renderMoveDirectionDropdown() {
        const movementTypes: string[] = this.props.settings.getVal(MoveNodeProps.AllActions);
        const val: string = this.props.settings.getVal(MoveNodeProps.Action);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled className="input-label">Action</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={MoveNodeProps.Action}
                        values={movementTypes}
                        currentValue={val}
                        placeholder="Select Movement"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }
}