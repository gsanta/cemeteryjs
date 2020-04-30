import * as React from 'react';
import { AppContext, AppContextType } from '../../../../gui/Context';
import { PauseIconComponent } from '../../../../gui/icons/PauseIconComponent';
import { PlayIconComponent } from '../../../../gui/icons/PlayIconComponent';
import { StopIconComponent } from '../../../../gui/icons/StopIconComponent';
import { AccordionComponent } from '../../../../gui/misc/AccordionComponent';
import { SettingsRowStyled } from './SettingsComponent';
import { Editor } from '../../../../Editor';

export class GlobalSettingsComponent extends React.Component<{editor: Editor}> {
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
                <PlayIconComponent onClick={() => this.context.getServices().game.playAllMovements()}/>
                <PauseIconComponent onClick={() => this.context.getServices().game.pauseAllMovements()}/>
                <StopIconComponent onClick={() => this.context.getServices().game.resetAllMovements()}/>
            </SettingsRowStyled>
        )
    }
}