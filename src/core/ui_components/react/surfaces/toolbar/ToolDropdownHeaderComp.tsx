import * as React from 'react';
import { UI_ToolDropdownHeader } from '../../../elements/toolbar/UI_ToolDropdownHeader';
import { UI_ContainerProps } from '../../UI_ComponentProps';

export const ToolDropdownHeaderComp = (props: UI_ContainerProps<UI_ToolDropdownHeader>) => {
    return (
        <div>
            {props.children[0]}
        </div>
    );
}
