import * as React from 'react';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
 
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
}

export class ColorPicker extends React.Component<ColorPickerProps> {
 
  render() {
        return (
            <ColorPickerStyled>
                <ColorStyled onClick={() => this.props.onOpen()}/>
                <PopoverStyled>
                    <CoverStyled onClick={() => this.props.onClose()}/>
                    <SketchPicker color={'red'} onChange={() => null} />
                </PopoverStyled>
            </ColorPickerStyled>
        )
    }
}