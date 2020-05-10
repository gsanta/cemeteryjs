import * as React from 'react';
import { AppContext, AppContextType } from '../../../editor/gui/Context';
import { PauseIconComponent } from '../../../editor/gui/icons/PauseIconComponent';
import { PlayIconComponent } from '../../../editor/gui/icons/PlayIconComponent';
import { StopIconComponent } from '../../../editor/gui/icons/StopIconComponent';
import { AccordionComponent } from '../../../editor/gui/misc/AccordionComponent';
import { SettingsRowStyled } from './SettingsComponent';
import { Editor } from '../../../editor/Editor';

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
                <PlayIconComponent onClick={() => this.context.registry.services.game.playAllMovements()}/>
                <PauseIconComponent onClick={() => this.context.registry.services.game.pauseAllMovements()}/>
                <StopIconComponent onClick={() => this.context.registry.services.game.resetAllMovements()}/>
            </SettingsRowStyled>
        )
    }
}