import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import * as ab2str from 'arraybuffer-to-string';
import { withCommitOnChange } from '../../forms/decorators/withCommitOnChange';
import { ToolStyled, ToolIconStyled, ToolIconBackgroundStyled, ToolIconImageStyled, ToolNameStyled } from './ToolIcon';

export interface ImportFileIconProps {
    onChange(file: {path: string, data: string}): void;
    placeholder: string;
    value?: string;
    readDataAs: 'text' | 'dataUrl'
}

export const ImportFileIconComponent = (props: ImportFileIconProps) => {
    const onDrop = React.useCallback(acceptedFiles => {
        const reader = new FileReader()
    
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = (e) => {
            props.onChange({path: acceptedFiles[0].path, data: e.target.result as string});
        }
        if (props.readDataAs === 'text') {
            reader.readAsText(acceptedFiles[0]);
        } else {
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return (
        <ToolStyled {...getRootProps()} onClick={() => null} format="long" isActive={false}>
            <input {...getInputProps()} />
            <ToolIconStyled viewBox="0 0 24 24" style={{overflow: 'visible'}}>
                <ToolIconBackgroundStyled isActive={false} d="M0 0h24v24H0z" fill="none"/>
                <ToolIconImageStyled isActive={false} d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </ToolIconStyled>

            <ToolNameStyled>
                {props.value ? props.value : props.placeholder}
            </ToolNameStyled>
        </ToolStyled>   
    )
}

export const ConnectedFileUploadComponent = withCommitOnChange<ImportFileIconProps>(ImportFileIconComponent);