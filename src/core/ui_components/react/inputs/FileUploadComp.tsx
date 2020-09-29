import React from "react"
import { UI_ComponentProps } from "../UI_ComponentProps"
import { UI_FileUpload } from "../../elements/UI_FileUpload"
import { useDropzone } from "react-dropzone"
import styled from "styled-components";
import { colors } from "../styles"

const FileUploadStyled = styled.div`

    &.file-upload {
        display: flex;

        &:focus {
            outline: none;
        }

        &.full-width {
            width: 100%;
        }

        & > div {
            display: flex;
            width: 100%;
            align-items: center;
            cursor: pointer;
    
            &.normal-width {
                padding: 0px 5px;
            }
    
            .button-label {
                padding-left: 5px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            border: 2px dashed ${colors.grey3};
        };

    }
`;

export const FileUploadComp = (props: UI_ComponentProps<UI_FileUpload>) => {
    const onDrop = React.useCallback(acceptedFiles => {
        const reader = new FileReader()
    
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = (e) => {
            var binary = '';
            var bytes = new Uint8Array( reader.result as ArrayBuffer );
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode( bytes[ i ] );
            }

            const b64Text = `data:application/octet-stream;base64,${btoa(binary)}`;
            console.log(b64Text);
            props.element.change({path: acceptedFiles[0].path, data: b64Text});
        }
        // if (props.readDataAs === 'text') {
            // reader.readAsText(acceptedFiles[0]);
        // } else {
            // }

            //
        reader.readAsArrayBuffer(acceptedFiles[0]);
    }, [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    const style: React.CSSProperties = {}
    props.element.width && (style.width = props.element.width);

    return (
        <FileUploadStyled style={style} className='file-upload' {...getRootProps()}>
            <div className='file-upload' onClick={() => props.element.click(props.registry)}>
                <input {...getInputProps()} />
                
                <div className="button-label" style={{width: props.element.width ? props.element.width : 'auto'}}>
                    {props.element.label}
                </div>
            </div>  
        </FileUploadStyled>
    )
}