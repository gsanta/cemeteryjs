

import * as React from 'react';
import { UI_Text } from '../../elements/UI_Text';

export interface TextCompProps {
    element: UI_Text;
}

export const TextComp = (props: TextCompProps) => {

    const style: React.CSSProperties = {
        fontSize: props.element.size === 'small' ? '12px' : '14px'
    };

    props.element.isBold && (style.fontWeight = 'bold');
    props.element.color && (style.color = props.element.color);
    
    return (
        <span style={style}>{props.element.text}</span> 
    );
}