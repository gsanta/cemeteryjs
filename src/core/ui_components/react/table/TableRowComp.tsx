

import * as React from 'react';
import { UI_TableRow } from '../../elements/UI_Table';
import { cssClassBuilder } from '../../../ui_regions/components/layout/RowComp';

export interface TableRowCompProps {
    element: UI_TableRow;
    children?: JSX.Element[];
}

export const TableRowComp = (props: TableRowCompProps) => {
    const classes = cssClassBuilder(
        'ce-table-row',
        props.element.isHeader ? 'ce-table-header' : undefined
    )    
    return (
        <div className={classes}>{props.children}</div>
    );
}