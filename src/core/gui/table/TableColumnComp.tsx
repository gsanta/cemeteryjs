

import * as React from 'react';
import { UI_TableColumn } from '../../gui_builder/elements/UI_TableColumn';

export interface TableColumnCompProps {
    element: UI_TableColumn;
    children?: JSX.Element[];
}

export const TableColumnComp = (props: TableColumnCompProps) => {    
    return (
        <div>{props.children}</div>
    );
}