import * as React from 'react';
import styled from 'styled-components';
import { ICanvasController } from '../controllers/canvases/ICanvasController';
import { AppContext, AppContextType } from './Context';
import { ButtonComponent } from './forms/ButtonComponent';
import './Header.scss';
import { colors } from './styles';
import { saveAs } from 'file-saver';
import { FileUploader } from './forms/FileUploader';

export interface HeaderProps {
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
        return (
            <HeaderStyled>
                <CanvasHeaderStyled activeCanvas={this.context.controllers.svgCanvasController}>
                    {this.props.activeCanvasToolbar}
                </CanvasHeaderStyled>
                <FileUploader onUpload={(file) => this.context.controllers.svgCanvasController.writer.write(file)}/>
                <ButtonComponent text="Save file" onClick={() => this.saveFile()} type="success"/>
            </HeaderStyled>
        );
    }

    private saveFile() {
        const file = this.context.controllers.svgCanvasController.reader.read();
        var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "dynamic.txt");
    }
}