import * as React from 'react';
import styled from 'styled-components';
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
    padding: 0 10px;
    background: ${colors.grey2};
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
`;

const GlobalHeaderStyled = styled.div`
    display: flex;

    > *:not(last) {
        margin-right: 10px;    
    }
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
                <CanvasHeaderStyled>
                    {this.props.activeCanvasToolbar}
                </CanvasHeaderStyled>
                <GlobalHeaderStyled>
                    <FileUploader onUpload={(file) => this.context.controllers.svgCanvasController.writer.write(file)}/>
                    <ButtonComponent text="Save file" onClick={() => this.saveFile()} type="success"/>
                </GlobalHeaderStyled>
            </HeaderStyled>
        );
    }

    private saveFile() {
        const file = this.context.controllers.svgCanvasController.reader.read();
        var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "dynamic.txt");
    }
}