import * as React from 'react';
import { UI_GridSelect } from '../../gui_builder/elements/UI_GridSelect';
import { GridComponent } from '../misc/GridComponent';
import { UI_ComponentProps } from '../UI_ComponentProps';
import './DropdownComponent.scss';

export const GridSelectComp = (props: UI_ComponentProps<UI_GridSelect>) => {

    const gridSelectComponent = (
        <GridComponent
            isReversed={false}
            markedValues={props.element.filledIndexes()}
            value={props.element.val()}
            onChange={(val) => props.element.change(val)}
        />
    )

    return gridSelectComponent;
}