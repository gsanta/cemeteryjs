

import * as React from 'react';
import { UI_ComponentProps } from '../UI_ComponentProps';
import { UI_Icon } from '../../elements/UI_Icon';
import styled from 'styled-components';
import { cssClassBuilder } from '../layout/RowComp';
import { colors } from '../styles';
const undoIcon = require('../../../../../assets/images/icons/undo.svg');
const redoIcon = require('../../../../../assets/images/icons/redo.svg');
const brushIcon = require('../../../../../assets/images/icons/brush.svg');
const pathIcon = require('../../../../../assets/images/icons/path.svg');
const panIcon = require('../../../../../assets/images/icons/pan.svg');
const selectIcon = require('../../../../../assets/images/icons/select.svg');
const deleteIcon = require('../../../../../assets/images/icons/delete.svg');
const zoomOutIcon = require('../../../../../assets/images/icons/zoom_out.svg');
const gamesIcon = require('../../../../../assets/images/icons/games.svg');
const zoomInIcon = require('../../../../../assets/images/icons/zoom_in.svg');
const fullScreenIcon = require('../../../../../assets/images/icons/fullscreen.svg');
const fullScreenExitIcon = require('../../../../../assets/images/icons/fullscreen_exit.svg');
const insertPhotoIcon = require('../../../../../assets/images/icons/insert_photo.svg');
const removeIcon = require('../../../../../assets/images/icons/remove.svg');
const doneIcon = require('../../../../../assets/images/icons/done.svg');
const playIcon = require('../../../../../assets/images/icons/play.svg');
const stopIcon = require('../../../../../assets/images/icons/stop.svg');

export const IconStyled = styled.div`
    &.ce-icon {
        width: 24px;
        height: 24px;
        margin: 1px;
        cursor: pointer;

        background-size: cover;
        background-repeat: no-repeat;
        background-color: white;

        &.ce-icon-success {
            background-color: lightgreen;
        }

        &.ce-icon-danger {
            background-color: ${colors.danger};
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

        &.insert-photo-icon {
            background-image: url(${insertPhotoIcon});
        }

        &.remove-icon {
            background-image: url(${removeIcon});
        }

        &.done-icon {
            background-image: url(${doneIcon});
        }

        &.games-icon {
            background-image: url(${gamesIcon});
        }

        &.play-icon {
            background-image: url(${playIcon});
        }

        &.stop-icon {
            background-image: url(${stopIcon});
        }
    }
`;

export interface IconCompProps extends UI_ComponentProps<UI_Icon> {
    tooltip: JSX.Element;
}

export class IconComp extends React.Component<IconCompProps> {
    private ref: React.RefObject<HTMLDivElement> = React.createRef();

    render() {
        const classes = cssClassBuilder(
            'ce-icon',
            this.props.element.variant ? `ce-icon-${this.props.element.variant}` : undefined,
            `${this.props.element.iconName}-icon`
        );
    
        if (this.props.element.iconName) {
            return (
                <IconStyled ref={this.ref} className={classes} id={this.props.element.uniqueId} onClick={() => this.props.element.click(this.props.registry)}>{this.props.tooltip}</IconStyled>
            )
        } else {
            return (
                <div 
                    style={{ 
                        width: this.props.element.width ? this.props.element.width : '100px',
                        height: this.props.element.height ? this.props.element.height : '100px',
                        background: 'black'
                    }}
                    id={this.props.element.uniqueId}
                    onClick={() => this.props.element.click(this.props.registry)}
                ></div>
            )
        }
    }
}