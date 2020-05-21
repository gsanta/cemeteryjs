import * as React from 'react';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { FieldColumnStyled, LabelColumnStyled, SettingsRowStyled } from '../../scene_editor/settings/SettingsComponent';
import { AbstractNodeSettingsComponent } from './AbstractNodeSettingsComponent';
import { MoveNodeProps } from './nodes/MoveNodeSettings';

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
        const movementTypes: string[] = this.props.settings.getVal(MoveNodeProps.AllMoves);
        const val: string = this.props.settings.getVal(MoveNodeProps.Move);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled className="input-label">Action</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={MoveNodeProps.Move}
                        values={movementTypes}
                        currentValue={val}
                        placeholder="Select Movement"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }
}