

import * as React from 'react';
import { UI_TableColumn } from '../../gui_builder/elements/UI_TableColumn';

export interface TableColumnCompProps {
    element: UI_TableColumn;
    children?: JSX.Element[];
}

export const TableColumnComp = (props: TableColumnCompProps) => {
    const style: any = {}
    
    if (props.element.width) {
        style.width = props.element.width;
    }

    return (
        <div style={style} className="ce-table-column">{props.children}</div>
    );
}