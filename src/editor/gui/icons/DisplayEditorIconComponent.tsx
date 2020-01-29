
import * as React from 'react';
import { ToolStyled, IconStyled, IconBackgroundStyled, IconImageStyled, ToolNameStyled, IconProps } from './Icon';
import { ICanvasController } from '../../controllers/canvases/ICanvasController';

export interface DisplayEditorIconProps {
    canvasController: ICanvasController;
    text: string; 
}

export class DisplayEditorIconComponent extends React.Component<DisplayEditorIconProps> {

    render() {
        const canvasController = this.props.canvasController;
        return (
            <ToolStyled onClick={() => canvasController.setVisible(!canvasController.isVisible())}>
                <IconStyled viewBox="0 0 24 24">                
                    <IconBackgroundStyled isActive={canvasController.isVisible()} d="M0 0h24v24H0z" fill="none"/>
                    <IconImageStyled isActive={canvasController.isVisible()} d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </IconStyled>
                
                <ToolNameStyled>
                    {this.props.text}
                </ToolNameStyled>
            </ToolStyled>   
        )
    }
}