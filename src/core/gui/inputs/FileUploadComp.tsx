import React from "react"
import { Buttontyled } from "./ButtonComp"
import { iconFactory } from "../icons/iconFactory"
import { UI_ComponentProps } from "../UI_ComponentProps"
import { UI_FileUpload } from "../../gui_builder/elements/UI_FileUpload"
import { useDropzone } from "react-dropzone"

export const FileUploadComp = (props: UI_ComponentProps<UI_FileUpload>) => {
    const onDrop = React.useCallback(acceptedFiles => {
        const reader = new FileReader()
    
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = (e) => {
            props.element.change({path: acceptedFiles[0].path, data: e.target.result as string});
        }
        // if (props.readDataAs === 'text') {
            reader.readAsText(acceptedFiles[0]);
        // } else {
        //     reader.readAsDataURL(acceptedFiles[0]);
        // }
    }, [])
    const { getRootProps, getInputProps } = useDropzone({ onDrop })
    const icon = props.element.icon ? iconFactory(props.element.icon) : null;

    return (
        // <div {...getRootProps()}>
            
            <Buttontyled  {...getRootProps()} {...props} onClick={() => props.element.click()}>
                <input {...getInputProps()} />
                {icon}
                
                <div className="button-label">
                    {props.element.label}
                </div>
            </Buttontyled>  
        // </div>
    )
}