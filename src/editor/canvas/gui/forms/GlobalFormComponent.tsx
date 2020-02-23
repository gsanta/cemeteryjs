import * as React from 'react';
import { AppContext, AppContextType } from '../../../gui/Context';
import { PauseIconComponent } from '../../../gui/icons/PauseIconComponent';
import { PlayIconComponent } from '../../../gui/icons/PlayIconComponent';
import { StopIconComponent } from '../../../gui/icons/StopIconComponent';
import { AccordionComponent } from '../../../gui/misc/AccordionComponent';
import { SettingsRowStyled } from './FormComponent';
import { Editor } from '../../../Editor';

export class GlobalFormComponent extends React.Component<{editor: Editor}> {
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