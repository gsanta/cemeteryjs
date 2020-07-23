import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { colors } from '../../../core/gui/styles';
import { UI_Toolbar } from '../../gui_builder/elements/toolbar/UI_Toolbar';
import { UI_ComponentProps } from '../UI_ComponentProps';
import { cssClassBuilder } from '../../gui_builder/UI_ReactElements';
import { UI_Tool } from '../../gui_builder/elements/toolbar/UI_Tool';
import { ToolIconProps } from '../../../plugins/common/toolbar/icons/ToolIcon';
import tippy from 'tippy.js';
const undoIcon = require('../../../../assets/images/icons/undo.svg');
const redoIcon = require('../../../../assets/images/icons/redo.svg');
const brushIcon = require('../../../../assets/images/icons/brush.svg');
const pathIcon = require('../../../../assets/images/icons/path.svg');
const panIcon = require('../../../../assets/images/icons/pan.svg');
const selectIcon = require('../../../../assets/images/icons/select.svg');
const deleteIcon = require('../../../../assets/images/icons/delete.svg');
const zoomOutIcon = require('../../../../assets/images/icons/zoom_in.svg');
const zoomInIcon = require('../../../../assets/images/icons/zoom_out.svg');
const fullScreenIcon = require('../../../../assets/images/icons/fullscreen.svg');
const fullScreenExitIcon = require('../../../../assets/images/icons/fullscreen_exit.svg');

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
        cursor: pointer;

        color: ${(props: ToolIconProps) => props.color ? props.color : colors.textColor};

        background: ${colors.grey3};
        &:hover {
            background: ${colors.hoverBackground};
        }

        &.undo-icon {
            background-image: url(${undoIcon});
        }

        &.redo-icon {
            background-image: url(${redoIcon});
        }

        &.brush-icon {
            background-image: url(${brushIcon});
        }

        &.path-icon {
            background-image: url(${pathIcon});
        }

        &.pan-icon {
            background-image: url(${panIcon});
        }

        &.select-icon {
            background-image: url(${selectIcon});
        }

        &.delete-icon {
            background-image: url(${deleteIcon});
        }

        &.zoom-in-icon {
            background-image: url(${zoomInIcon});
        }

        &.zoom-out-icon {
            background-image: url(${zoomOutIcon});
        }

        &.fullscreen-icon {
            background-image: url(${fullScreenIcon});
        }

        &.fullscreen-exit-icon {
            background-image: url(${fullScreenExitIcon});
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

export class ToolbarComp extends React.Component<ToolbarCompProps> {
    static contextType = AppContext;
    context: AppContextType;

    render(): JSX.Element {
        const leftSection = <ToolGroupStyled>{this.props.toolsLeft}</ToolGroupStyled>
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

export interface ToolCompProps extends UI_ComponentProps<UI_Tool> {
    tooltip: JSX.Element;
}

export class ToolComp extends React.Component<ToolCompProps> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef();

    componentDidMount() {
        const tooltipHtml = `Eraser tool <b>(Shift + E)</b>`

        if (this.props.element.tooltip) {
            // tippy(this.ref.current as any, {
            //     content: this.props.element.tooltip,
            //     allowHTML: true
            // });
        }
    }
    
    render() {
        const classes = cssClassBuilder('ce-tool', `${this.props.element.icon}-icon`);
        return <div ref={this.ref} className={classes}></div>;
    }
}

