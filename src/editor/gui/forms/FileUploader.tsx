import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import * as ab2str from 'arraybuffer-to-string';
import styled from 'styled-components';
import { colors } from '../styles';

const FileUploaderStyled = styled.div`
    background: ${colors.success};
    height: 30px;
    padding: 5px 10px;
    cursor: pointer;
`;

export interface FileUploaderProps {
    onUpload(binString: string): void;
}

export const FileUploader = (props: FileUploaderProps) => {
    const onDrop = React.useCallback(acceptedFiles => {
        const reader = new FileReader()
    
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
        // Do whatever you want with the file contents
            const binaryStr = reader.result
            props.onUpload(ab2str(binaryStr as string));
        }
        reader.readAsArrayBuffer(acceptedFiles[0]);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <FileUploaderStyled>{isDragActive ? 'Drop scene file' : 'Import scene file'}</FileUploaderStyled>
        </div>
    )
}