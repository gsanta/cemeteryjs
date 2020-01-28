import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import * as ab2str from 'arraybuffer-to-string';
import styled from 'styled-components';
import { colors } from '../styles';
import { ToolStyled, IconStyled, IconBackgroundStyled, IconImageStyled, ToolNameStyled } from './Icon';

const FileUploaderStyled = styled.div`
    background: ${colors.success};
    height: 30px;
    padding: 5px 10px;
    cursor: pointer;
`;

export class ExportFileIconComponent extends React.Component {

    render() {
        return (
            <ToolStyled onClick={() => this.saveFile()}>
                <IconStyled viewBox="0 0 24 24">
                    <IconBackgroundStyled isActive={false} d="M0 0h24v24H0z" fill="none"/>
                    <IconImageStyled isActive={false} d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                </IconStyled>
                <ToolNameStyled>
                    Export file
                </ToolNameStyled>
            </ToolStyled>   
        )
    }

    private saveFile() {
        const file = this.context.controllers.svgCanvasController.reader.export();
        var blob = new Blob([file], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "dynamic.txt");
    }
}