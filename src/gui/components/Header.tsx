import * as React from 'react';
import './Header.scss';
import { ButtonComponent } from './forms/ButtonComponent';
import styled from 'styled-components';
import { ConnectedDropdownComponent } from './forms/DropdownComponent';
import { AppContextType, AppContext } from './Context';
import { SettingsProperty } from '../controllers/forms/SettingsForm';
import { ConnectedToggleButtonComponent } from './forms/ToggleButtonComponent';
import { colors } from './styles';
import { ICanvasController } from '../controllers/canvases/ICanvasController';

export interface HeaderProps {
    openIntegrationCodeDialog(): void;
    openHowToIntegrateDialog(): void;
    openAboutDialog(): void;
    activeCanvasToolbar: JSX.Element;
}

const HeaderStyled = styled.div`
    height: 40px;
    background: ${colors.grey3};
    display: flex;
    align-items: center;
    justify-content: space-between;

    .button {
        &:last-child {
            margin-right: 0px;   
        }
    }
`;

const CanvasHeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    width: 70%;
    height: 40px;
    background: ${(props: {activeCanvas: ICanvasController}) => colors.getCanvasBackground(props.activeCanvas)};
    padding: 5px 20px;
`;

export class Header extends React.Component<HeaderProps> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: HeaderProps) {
        super(props);

    }

    render() {
        const settingsController = this.context.controllers.settingsController;
        
        return (
            <HeaderStyled>
                <CanvasHeaderStyled activeCanvas={this.context.controllers.getActiveCanvas()}>
                    <div>
                        <ConnectedDropdownComponent
                            values={this.context.controllers.editors.map(editor => editor.getId())}
                            currentValue={settingsController.getVal(SettingsProperty.EDITOR) as string}
                            formController={settingsController}
                            propertyName={SettingsProperty.EDITOR}
                            propertyType='string'
                        />
                    </div>
                    {this.props.activeCanvasToolbar}
                    <div>
                        <ConnectedToggleButtonComponent
                            text="Show Properties"
                            isActive={settingsController.getVal(SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN) as boolean}
                            formController={settingsController}
                            propertyName={SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN}
                            propertyType="boolean"
                        />
                    </div>
                </CanvasHeaderStyled>
                <div>
                    <ButtonComponent text="About" type="info" onClick={() => this.props.openAboutDialog()}/>
                </div>
            </HeaderStyled>
        );
    }
}