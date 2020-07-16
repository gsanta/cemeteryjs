

import * as React from 'react';
import { UI_Table } from '../../gui_builder/elements/UI_Table';

export interface TableCompProps {
    element: UI_Table;
    children?: JSX.Element[];
}

export const TableComp = (props: TableCompProps) => {    
    return (
        <div>{props.children}</div>
    );
}