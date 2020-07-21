import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { colors } from '../../../core/gui/styles';
import { UI_Toolbar } from '../../gui_builder/elements/toolbar/UI_Toolbar';
import { UI_ComponentProps } from '../UI_ComponentProps';
import { cssClassBuilder } from '../../gui_builder/UI_ReactElements';
import { UI_Tool } from '../../gui_builder/elements/toolbar/UI_Tool';
const undoIcon = require('../../../../assets/images/icons/undo.svg');

const ToolbarStyled = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    height: 40px;
    padding: 5px 10px;
    z-index: 100;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    background-color: transparent;

    > *:not(:last-child) {
        margin-right: 1px;
    }

    .ce-tool {
        width: 24px;
        height: 24px;

        &.undo {
            background-image: url(${undoIcon});
        }
    }
`;

const ToolGroupStyled = styled.div`
    display: flex;
    border: 1px solid ${colors.panelBackgroundLight};
    height: 26px;
`;

export interface ToolbarCompProps extends UI_ComponentProps<UI_Toolbar> {
    toolsLeft: JSX.Element[];
    toolsMiddle: JSX.Element[];
    toolsRight: JSX.Element[];
}

export class ToolbarComp extends React.Component<UI_ComponentProps<UI_Toolbar>> {
    static contextType = AppContext;
    context: AppContextType;

    render(): JSX.Element {
        const leftSection = <ToolGroupStyled></ToolGroupStyled>
        const middleSection = <ToolGroupStyled></ToolGroupStyled>
        const rightSection =  <ToolGroupStyled></ToolGroupStyled>;

        return (
            <ToolbarStyled {...this.props}>
                <div>
                    {leftSection}                    
                </div>
                <div>
                    {middleSection}
                </div>
                <div>
                    {rightSection}
                </div>
            </ToolbarStyled>
        )
    }
}

export const ToolComp = (props: UI_ComponentProps<UI_Tool>) => {
    const classes = cssClassBuilder('ce-tool', props.element.icon);
    return <div className={classes}></div>;
}