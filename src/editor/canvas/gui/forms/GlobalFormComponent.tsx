import * as React from 'react';
import { Controllers } from '../../../Controllers';
import { AppContext, AppContextType } from '../../../gui/Context';
import { PauseIconComponent } from '../../../gui/icons/PauseIconComponent';
import { PlayIconComponent } from '../../../gui/icons/PlayIconComponent';
import { StopIconComponent } from '../../../gui/icons/StopIconComponent';
import { AccordionComponent } from '../../../gui/misc/AccordionComponent';
import { SettingsRowStyled } from './FormComponent';

export class GlobalFormComponent extends React.Component<{editor: Controllers}> {
    static contextType = AppContext;
    context: AppContextType;


    render() {

        const body = this.renderMovements();

        return (
            <AccordionComponent
                level="secondary"
                elements={[
                    {
                        title: 'Movements',
                        body
                    }
                ]}
            />
        )
    }

    private renderMovements() {
        return (
            <SettingsRowStyled verticalAlign='center'>
                <PlayIconComponent onClick={() => this.props.editor.gameApi.playAllMovements()}/>
                <PauseIconComponent onClick={() => this.props.editor.gameApi.pauseAllMovements()}/>
                <StopIconComponent onClick={() => this.props.editor.gameApi.resetAllMovements()}/>
            </SettingsRowStyled>
        )
    }
}