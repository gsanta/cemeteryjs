import * as React from 'react';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
import { colors } from '../styles';
import { InputFieldCommands } from './InputFieldCommands';
 
const ColorPickerStyled = styled.div`
    width: 20px;
    height: 20px;
    position: relative;
`;

const ColorStyled = styled.div`
    border: 1px solid ${colors.textColor};
    width: 20px;
    height: 20px;
    background-color: ${({color}: {color: string}) => color};
`;

const PopoverStyled = styled.div`
    position: absolute;
    z-index: 2;
`;

const CoverStyled = styled.div`
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
`;

export interface ColorPickerProps {
    onClose(): void;
    onOpen(): void;
    onColorChange(color: string): void;
    isOpen: boolean;
    color: string;
}

export function ColorPicker(props: ColorPickerProps) { 
    return (
        <ColorPickerStyled>
            <ColorStyled id="color-styled" color={props.color} onClick={() => props.onOpen()}/>
            <PopoverStyled>
                { props.isOpen ? <CoverStyled onClick={() => props.onClose()}/> : null}
                { props.isOpen ? <SketchPicker color={props.color} onChange={(color) => props.onColorChange(color.hex)} /> : null}
            </PopoverStyled>
        </ColorPickerStyled>
    )
}

function withController(WrappedComponent: React.ComponentType<ColorPickerProps>) {
    return class extends React.Component<Omit<ColorPickerProps & InputFieldCommands<any>, 'onOpen' | 'onClose' | 'onColorChange' | 'isOpen' | 'color'>> {

        render(): JSX.Element {
            // it seems to be a react bug to have to cast props to any
            return <WrappedComponent 
                {...this.props as any}
                onOpen={() => this.props.formController.focusProp(this.props.propertyName)}
                isOpen={this.props.formController.getFocusedProp() === this.props.propertyName}
                onColorChange={(color: string) => this.props.formController.updateFocusedProp(color)}
                onClose={() => this.props.formController.blurProp()}
                color={this.props.formController.getVal(this.props.propertyName)}
            />
        }
    }
}

export const ConnectedColorPicker = withController(ColorPicker);