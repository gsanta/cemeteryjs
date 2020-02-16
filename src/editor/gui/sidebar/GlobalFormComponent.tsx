import * as React from 'react';
import { AppContext, AppContextType } from '../Context';
import { PauseIconComponent } from '../icons/PauseIconComponent';
import { PlayIconComponent } from '../icons/PlayIconComponent';
import { StopIconComponent } from '../icons/StopIconComponent';
import { AccordionComponent } from '../misc/AccordionComponent';
import { SettingsRowStyled } from './FormComponent';

export class GlobalFormComponent extends React.Component {
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
                <PlayIconComponent 
                    onClick={() => this.context.controllers.webglCanvasController.gameFacade.gameApi.playAllMovements()}
                    disabled={false}
                />
                <PauseIconComponent onClick={() => this.context.controllers.webglCanvasController.gameFacade.gameApi.pauseAllMovements()} disabled={false}/>
                <StopIconComponent onClick={() => this.context.controllers.webglCanvasController.gameFacade.gameApi.resetAllMovements()} disabled={false}/>
            </SettingsRowStyled>
        )
    }
}