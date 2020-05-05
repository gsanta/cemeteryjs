import * as React from 'react';
import { AppContext, AppContextType } from '../../../../gui/Context';
import { ButtonComponent } from '../../../../gui/inputs/ButtonComponent';
import { FieldColumnStyled, SettingsRowStyled } from './SettingsComponent';
import { ActionSettings } from '../../settings/ActionSettings';

export class ActionSettingsComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    render() {
        return (
            <div>
                <SettingsRowStyled>
                    <FieldColumnStyled>
                        <ButtonComponent text="Add new action" type="info" onClick={() => this.context.registry.services.dialog.openDialog(ActionSettings.name)}/>
                    </FieldColumnStyled>
                </SettingsRowStyled>
            </div>
        );
    }
}