import * as React from 'react';
import styled from 'styled-components';
import { ToolIconProps } from '../../../../plugins/common/toolbar/icons/ToolIcon';
import { UI_Toolbar } from '../../../gui_builder/elements/toolbar/UI_Toolbar';
import { AppContext, AppContextType } from '../../Context';
import { colors } from '../../styles';
import { UI_ComponentProps } from '../../UI_ComponentProps';
const undoIcon = require('../../../../../assets/images/icons/undo.svg');
const redoIcon = require('../../../../../assets/images/icons/redo.svg');
const brushIcon = require('../../../../../assets/images/icons/brush.svg');
const pathIcon = require('../../../../../assets/images/icons/path.svg');
const panIcon = require('../../../../../assets/images/icons/pan.svg');
const selectIcon = require('../../../../../assets/images/icons/select.svg');
const deleteIcon = require('../../../../../assets/images/icons/delete.svg');
const zoomOutIcon = require('../../../../../assets/images/icons/zoom_out.svg');
const zoomInIcon = require('../../../../../assets/images/icons/zoom_in.svg');
const fullScreenIcon = require('../../../../../assets/images/icons/fullscreen.svg');
const fullScreenExitIcon = require('../../../../../assets/images/icons/fullscreen_exit.svg');

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

    .ce-tool-section {
        display: flex;
        height: 26px;
    }

    .ce-tool {
        width: 24px;
        height: 24px;
        cursor: pointer;

        color: ${(props: ToolIconProps) => props.color ? props.color : colors.textColor};

        background: ${colors.grey3};
        background-size: cover;
        background-repeat: no-repeat;

        &:hover, &.ce-tool-active {
            background: ${colors.hoverBackground};
            background-size: cover;
            background-repeat: no-repeat;
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
        return (
            <ToolbarStyled {...this.props}>
                <div className="ce-tool-section" key="left-section">
                    {this.props.toolsLeft}                    
                </div>
                <div className="ce-tool-section" key="middle-section">
                </div>
                <div className="ce-tool-section" key="right-section">
                </div>
            </ToolbarStyled>
        )
    }
}
