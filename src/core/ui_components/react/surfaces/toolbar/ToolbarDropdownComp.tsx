import * as React from 'react';
import { UI_ContainerProps } from '../../UI_ComponentProps';
import { UI_Toolbar } from '../../../elements/toolbar/UI_Toolbar';
import { UI_ToolbarDropdown } from '../../../elements/toolbar/UI_ToolbarDropdown';

export class ToolbarDropdownComp extends React.Component<UI_ContainerProps<UI_ToolbarDropdown>> {
    render(): JSX.Element {
        return (
            <div>
                <div>
                    <div>A</div>      
                    <div>B</div>      
                    <div>C</div>      
                </div>
            </div>
        )
    }
}
