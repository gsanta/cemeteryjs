import React from "react"
import { ButtonStyled } from "./ButtonComp"
import { iconFactory } from "../icons/iconFactory"
import { UI_ComponentProps } from "../UI_ComponentProps"
import { UI_FileUpload } from "../../ui_regions/elements/UI_FileUpload"
import { useDropzone } from "react-dropzone"
import styled from "styled-components";
import { cssClassBuilder } from "../layout/RowComp"
import { colors } from "../styles"

const FileUploadStyled = styled.div`

    &.file-upload {
        display: flex;

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

            border: 1px solid ${colors.grey3};
            &:hover {
                background: ${colors.hoverBackground};
            }
        };

    }
`;

export const FileUploadComp = (props: UI_ComponentProps<UI_FileUpload>) => {
    const onDrop = React.useCallback(acceptedFiles => {
        const reader = new FileReader()
    
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = (e) => {
            props.element.change({path: acceptedFiles[0].path, data: e.target.result as string});
        }
        // if (props.readDataAs === 'text') {
            // reader.readAsText(acceptedFiles[0]);
        // } else {
            reader.readAsDataURL(acceptedFiles[0]);
        // }
    }, [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop })
    const icon = props.element.icon ? iconFactory(props.element.icon) : null;

    const classes = cssClassBuilder(
        'file-upload',
        props.element.width ? props.element.width : 'normal-width'
    );

    return (
        <FileUploadStyled className={classes} {...getRootProps()}>
            <div className={classes} onClick={() => props.element.click()}>
                <input {...getInputProps()} />
                {icon}
                
                <div className="button-label">
                    {props.element.label}
                </div>
            </div>  
        </FileUploadStyled>
    )
}