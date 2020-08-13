

import * as React from 'react';
import { UI_ComponentProps } from '../UI_ComponentProps';
import { UI_Icon } from '../../elements/UI_Icon';
import styled from 'styled-components';
import { cssClassBuilder } from '../layout/RowComp';
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
const insertPhotoIcon = require('../../../../../assets/images/icons/insert_photo.svg');
const removeIcon = require('../../../../../assets/images/icons/remove.svg');

const IconStyled = styled.div`
    &.ce-icon {
        width: 24px;
        height: 24px;
        cursor: pointer;

        background-size: cover;
        background-repeat: no-repeat;
        background-color: white;

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
    }
`

export const IconComp = (props: UI_ComponentProps<UI_Icon>) => {
    const classes = cssClassBuilder(
        'ce-icon',
        `${props.element.iconName}-icon`
    );

    if (props.element.iconName) {
        return (
            <IconStyled className={classes} onClick={() => props.element.click()}/>
        )
    } else {
        return (
            <div 
                style={{ 
                    width: props.element.width ? props.element.width : '100px',
                    height: props.element.height ? props.element.height : '100px',
                    background: 'black'
                }}
                onClick={() => props.element.click()}
            ></div>
        )
    }
}

IconComp.displayName = 'IconComp';