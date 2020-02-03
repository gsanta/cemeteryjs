import * as React from 'react';
import FormControl from 'react-bootstrap/FormControl';
import styled from 'styled-components';
import { colors } from '../styles';
import { Focusable } from './Focusable';
import './InputComponent.scss';

export interface FileUploadProps extends Focusable {
    onChange(fileName: string): void;
    name: string;
}

const FormControlStyled = styled.input`
    background-color: ${colors.active};
    color: ${colors.textColorDark};
    border-radius: 0;
    box-shadow: none;
    border: 1px solid ${colors.grey4};

    &:focus {
        box-shadow: none;
    }

    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
`

export class FileUploadComponent extends React.Component<FileUploadProps> {

    render(): JSX.Element {
        return (
            <div>
                <FormControlStyled
                    type="file"
                    name={this.props.name}
                    id={this.props.name}
                    onFocus={() => this.props.onFocus()}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        this.loadFile(e.target.files[0])
                            .then(fileData => this.props.onChange(fileData))
                            .catch(() => console.error('Error uploading file.'));
                    }}
                    onBlur={() => this.props.onBlur()}
                />
                <label htmlFor={this.props.name}>
                    

                </label>
            </div>
        );
    }

    private loadFile(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader: FileReader = new FileReader();

            reader.onload = (e: any) => resolve(file.name);
            reader.readAsDataURL(file);
        });
    }
}