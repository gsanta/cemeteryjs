

import * as React from 'react';
import { UI_Image } from '../../ui_regions/elements/UI_Image';
import { UI_ComponentProps } from '../UI_ComponentProps';

export const ImageComp = (props: UI_ComponentProps<UI_Image>) => {
    if (props.element.src) {
        return (
            <img 
                src={props.element.src}
                style={{ width: props.element.width ? props.element.width : '100px', height: props.element.height ? props.element.height : '100px'}}
            />
        )
    } else {
        return (
            <div 
                style={{ 
                    width: props.element.width ? props.element.width : '100px',
                    height: props.element.height ? props.element.height : '100px',
                    background: 'black'
                }}
            ></div>
        )
    }
}