

import * as React from 'react';
import { UI_TableRow } from '../../gui_builder/elements/UI_Table';

export interface TableRowCompProps {
    element: UI_TableRow;
    children?: JSX.Element[];
}

export const TableRowComp = (props: TableRowCompProps) => {    
    return (
        <div className="ce-table-row">{props.children}</div>
    );
}