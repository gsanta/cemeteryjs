

import * as React from 'react';
import { UI_Text } from '../../elements/UI_Text';
import { sizes } from '../styles';

export interface TextCompProps {
    element: UI_Text;
}

export const TextComp = (props: TextCompProps) => {    
    return (
        <span style={{ fontSize: props.element.size === 'small' ? '12px' : '14px'}}>{props.element.text}</span> 
    );
}