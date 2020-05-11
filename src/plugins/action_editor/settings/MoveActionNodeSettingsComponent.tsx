import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { ConnectedDropdownComponent } from '../../../core/gui/inputs/DropdownComponent';
import { FieldColumnStyled, LabelColumnStyled, SettingsRowStyled } from '../../scene_editor/settings/SettingsComponent';
import { ActionNodeSettingsProps } from './ActionNodeSettings';
import { ActionNodeProps } from './actionNodeSettingsFactory';

export class MoveActionNodeSettingsComponent extends React.Component<ActionNodeProps> {
    static contextType = AppContext;
    context: AppContextType;


    render() {
        return (
            <div>
                {this.renderMoveDirectionDropdown()}
            </div>
        )
    }

    private renderMoveDirectionDropdown() {
        const movementTypes: string[] = this.props.settings.getVal(ActionNodeSettingsProps.AllMovements);
        const val: string = this.props.settings.getVal(ActionNodeSettingsProps.Movement);

        return (
            <SettingsRowStyled>
                <LabelColumnStyled className="input-label">Movement</LabelColumnStyled>
                <FieldColumnStyled>
                    <ConnectedDropdownComponent
                        formController={this.props.settings}
                        propertyName={ActionNodeSettingsProps.Movement}
                        values={movementTypes}
                        currentValue={val}
                        placeholder="Select Movement"
                    />
                </FieldColumnStyled>
            </SettingsRowStyled>
        );
    }
}