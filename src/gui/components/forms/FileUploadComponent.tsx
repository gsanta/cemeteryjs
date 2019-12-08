import * as React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import styled from 'styled-components';
import { FileData } from '../../controllers/canvases/svg/models/PixelModel';
import { colors } from '../styles';
import { withCommitOnChange } from './decorators/withCommitOnChange';
import { Focusable } from './Focusable';
import './InputComponent.scss';

export interface FileUploadProps extends Focusable {
    onChange(fileData: FileData): void;
}

const FormControlStyled = styled(FormControl)`
    background-color: ${colors.active};
    color: ${colors.textColorDark};
    border-radius: 0;
    box-shadow: none;
    border: 1px solid ${colors.grey4};

    &:focus {
        box-shadow: none;
        border: ${({isMarked}) => isMarked ? `1px solid ${colors.grey2}` : `1px solid ${colors.grey4}`};
    }
`

export class FileUploadComponent extends React.Component<FileUploadProps> {

    render(): JSX.Element {
        return (
            <FormControlStyled
                type="file"
                onFocus={() => this.props.onFocus()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.loadFile(e.target.files[0])
                        .then(fileData => this.props.onChange(fileData))
                        .catch(() => console.error('Error uploading file.'));
                }}
                onBlur={() => this.props.onBlur()}
            />
        );
    }

    private loadFile(file: File): Promise<FileData> {
        return new Promise<FileData>((resolve, reject) => {
            const reader: FileReader = new FileReader();

            reader.onload = (e: any) => resolve({fileName: file.name, data: e.target.result});
            reader.readAsDataURL(file);
        });
    }
}

export const ConnectedFileUploadComponent = withCommitOnChange<FileUploadProps>(FileUploadComponent);