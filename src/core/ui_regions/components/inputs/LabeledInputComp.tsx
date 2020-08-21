import * as React from 'react';
import styled from 'styled-components';

export interface LabeledProps {
    label: string
    children: JSX.Element;
    direction: 'horizontal' | 'vertical'
    style?: React.CSSProperties;
}

const LabeledComponentStyled = styled.div`
    margin-bottom: 5px;
    width: 100%;

        align-items: center;
    }

    .label {
        font-size: 12px;
        width: 30%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .input {
        width: 70%;
    }
`;

export function LabeledInputComp(props: LabeledProps) {
    return (
        <LabeledComponentStyled style={props.style} className={`labeled-component ${props.direction}`}>
            <div className="label">{props.label}</div>
            <div className="input">{props.children}</div>
        </LabeledComponentStyled>
    )
}