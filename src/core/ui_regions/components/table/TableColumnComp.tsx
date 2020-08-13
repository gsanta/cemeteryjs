

import * as React from 'react';
import { UI_TableColumn } from '../../elements/UI_TableColumn';

export interface TableColumnCompProps {
    element: UI_TableColumn;
    children?: JSX.Element[];
}

export const TableColumnComp = (props: TableColumnCompProps) => {
    const style: any = {}
    
    style.width = props.element._derivedWidth ? props.element._derivedWidth : props.element.width ? props.element.width : '100%';

    return (
        <div style={style} className="ce-table-column">{props.children}</div>
    );
}