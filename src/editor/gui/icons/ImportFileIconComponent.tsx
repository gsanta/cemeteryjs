import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import * as ab2str from 'arraybuffer-to-string';
import { ToolStyled, IconStyled, IconBackgroundStyled, IconImageStyled, ToolNameStyled } from './Icon';
import { withCommitOnChange } from '../forms/decorators/withCommitOnChange';

export interface ImportFileIconProps {
    onChange(file: {path: string, data: string}): void;
    placeholder: string;
    value?: string;
}

export const ImportFileIconComponent = (props: ImportFileIconProps) => {
    const onDrop = React.useCallback(acceptedFiles => {
        const reader = new FileReader()
    
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = (e) => {
            const binaryStr = reader.result
            props.onChange({path: acceptedFiles[0].path, data: e.target.result as string});
        }
        reader.readAsDataURL(acceptedFiles[0]);
    }, [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return (
        <ToolStyled {...getRootProps()}>
            <input {...getInputProps()} />
            <IconStyled viewBox="0 0 24 24" style={{overflow: 'visible'}}>
                <IconBackgroundStyled isActive={false} d="M0 0h24v24H0z" fill="none"/>
                <IconImageStyled isActive={false} d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </IconStyled>

            <ToolNameStyled>
                {props.value ? props.value : props.placeholder}
            </ToolNameStyled>
        </ToolStyled>   
    )
}

export const ConnectedFileUploadComponent = withCommitOnChange<ImportFileIconProps>(ImportFileIconComponent);