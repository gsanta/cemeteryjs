
import * as React from 'react';
import { ToolStyled, ToolIconStyled, ToolIconBackgroundStyled, ToolIconImageStyled, ToolNameStyled, IconProps } from './Icon';
import { AbstractCanvasController } from '../../../controllers/canvases/AbstractCanvasController';

export interface DisplayEditorIconProps {
    canvasController: AbstractCanvasController;
}

export class DisplayEditorIconComponent extends React.Component<DisplayEditorIconProps> {

    render() {
        const canvasController = this.props.canvasController;
        return (
            <ToolStyled onClick={() => canvasController.setVisible(!canvasController.isVisible())}>
                <ToolIconStyled viewBox="0 0 24 24">                
                    <ToolIconBackgroundStyled isActive={canvasController.isVisible()} d="M0 0h24v24H0z" fill="none"/>
                    <ToolIconImageStyled isActive={canvasController.isVisible()} d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </ToolIconStyled>
                
                <ToolNameStyled>
                    {canvasController.isVisible() ? `Hide ${canvasController.name}` : `Display ${canvasController.name}`}
                </ToolNameStyled>
            </ToolStyled>   
        )
    }
}