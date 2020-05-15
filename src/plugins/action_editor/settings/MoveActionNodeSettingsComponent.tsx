import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { FieldColumnStyled, LabelColumnStyled, SettingsRowStyled } from '../../scene_editor/settings/SettingsComponent';
import { ActionNodeProps } from './nodes/actionNodeSettingsFactory';
import { MoveNodeProps } from './nodes/MoveNodeSettings';

export class MoveActionNodeSettingsComponent extends React.Component<ActionNodeProps> {
    static contextType = AppContext;
    context: AppContextType;


    render() {
        return (
            <div>
                {this.renderMoveDirectionDropdown()}\
            </div>
        )
    }

    private renderMoveDirectionDropdown() {
        const movementTypes: string[] = this.props.settings.getVal(MoveNodeProps.AllMovements);
        const val: string = this.props.settings.getVal(MoveNodeProps.Movement);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled className="input-label">Movement</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={MoveNodeProps.Movement}
                        values={movementTypes}
                        currentValue={val}
                        placeholder="Select Movement"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }
}