import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import * as ab2str from 'arraybuffer-to-string';

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
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    )
}