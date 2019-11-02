import * as React from 'react';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
import { InputFieldCommands } from './decorators/InputFieldCommands';
 
const ColorPickerStyled = styled.div`
    width: 20px;
    height: 20px;
    position: relative;
`;

const ColorStyled = styled.div`
    width: 20px;
    height: 20px;
    background-color: green;
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
}

export function ColorPicker(props: ColorPickerProps) { 
    return (
        <ColorPickerStyled>
            <ColorStyled id="color-styled" onClick={() => props.onOpen()}/>
            <PopoverStyled>
                { props.isOpen ? <CoverStyled onClick={() => props.onClose()}/> : null}
                { props.isOpen ? <SketchPicker color={'red'} onChange={(color) => props.onColorChange(color.hex)} /> : null}
            </PopoverStyled>
        </ColorPickerStyled>
    )
}

function withController(WrappedComponent: React.ComponentType<ColorPickerProps>) {
    return class extends React.Component<Omit<ColorPickerProps & InputFieldCommands<any>, 'onOpen' | 'onClose' | 'onColorChange' | 'isOpen'>> {

        render(): JSX.Element {
            // it seems to be a react bug to have to cast props to any
            return <WrappedComponent 
                {...this.props as any}
                onOpen={() => this.props.formController.focusProp(this.props.propertyName)}
                isOpen={this.props.formController.getFocusedProp()}
                onColorChange={(color: string) => {
                    this.props.formController.updateStringProp(color);
                    this.props.formController.commitProp();
                }}
                onClose={() => null}
            />
        }
    }
}

export const ConnectedColorPicker = withController(ColorPicker);