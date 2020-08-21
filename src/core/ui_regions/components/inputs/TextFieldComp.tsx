import * as React from 'react';
import { UI_TextField } from '../../elements/UI_TextField';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import { colors } from '../styles';

const FormControlStyled = styled(Form.Control)`
    background-color: ${colors.active};
    color: ${colors.textColorDark};
    border-radius: 0;
    box-shadow: none;
    border: 1px solid ${colors.grey4};

    &:focus {
        box-shadow: none;
    }
`;

export function TextFieldComp(props: {element: UI_TextField}) {
    const inputStyle: React.CSSProperties = {
        minWidth: '100px',
        height: '25px',
        borderRadius: 0
    };

    props.element.inputWidth && (inputStyle.width = props.element.inputWidth);


    let textFieldComponent = (
        <FormControlStyled
            style={inputStyle}
            block
            type={props.element.type}
            onFocus={() => props.element.focus()}
            value={props.element.val()}
            onChange={val => props.element.change(val)}
            onBlur={() => props.element.blur()}
        />
    );

    if (props.element.label) {
        const style: React.CSSProperties = {
            display: 'flex',
            width: '100%'
        };
        
        if (props.element.layout === 'horizontal') {
            style.flexDirection = 'row';
            style.justifyContent = 'space-between';
            style.alignItems = 'center';
        } else {
            style.flexDirection = 'column';
        }

        return (
            <div style={style} className={`labeled-input ${props.element.layout}`}>
                <div className="label">{props.element.label}</div>
                <div className="input">{textFieldComponent}</div>
            </div>
        )
    } else {
        return textFieldComponent;
    }
}