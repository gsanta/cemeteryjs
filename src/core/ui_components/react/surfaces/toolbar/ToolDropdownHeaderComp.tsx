import * as React from 'react';
import { UI_ToolDropdownHeader } from '../../../elements/toolbar/UI_ToolDropdownHeader';
import { UI_ContainerProps } from '../../UI_ComponentProps';

export const ToolDropdownHeaderComp = (props: UI_ContainerProps<UI_ToolDropdownHeader>) => {
    return (
        <div className="ce-toolbar-dropdown-header">
            {props.children[0]}
            <div className="ce-menu-expand" onClick={() => props.element.paramController.select(props.element.val)}></div>
        </div>
    );
}
