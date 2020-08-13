

import * as React from 'react';
import { UI_ComponentProps } from '../UI_ComponentProps';
import { UI_TableRowGroup } from '../../elements/surfaces/table/UI_TableRowGroup';

export const TableRowGroupComp = (props: UI_ComponentProps<UI_TableRowGroup>) => {
    return (
        <div className="ce-table-row-group">{props.element.text}</div>
    );
}