import * as React from 'react';
import { UI_ContainerProps } from '../../UI_ComponentProps';
import { UI_ToolbarDropdown } from '../../../elements/toolbar/UI_ToolbarDropdown';

export interface ToolbarDropdownProps extends UI_ContainerProps<UI_ToolbarDropdown> {
    header: JSX.Element;
}

export const ToolbarDropdownComp = (props: ToolbarDropdownProps) => {
    return (
        <div className="ce-toolbar-dropdown">
            {props.header}
            <div className="ce-toolbar-dropdown-tools">

                {props.children}
            </div>
        </div>
    );
}
