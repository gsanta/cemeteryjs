

import * as React from 'react';
import { UI_Table } from '../../gui_builder/elements/UI_Table';
import styled from 'styled-components';

const TableCompStyled = styled.div`
    .ce-table-row {
        display: flex;
        justify-content: space-between;
    }
`;

export interface TableCompProps {
    element: UI_Table;
    children?: JSX.Element[];
}

export const TableComp = (props: TableCompProps) => {
    const style: any = {}
    
    if (props.element.width) {
        style.width = props.element.width;
    }

    return (
        <TableCompStyled className="ce-table" style={style}>{props.children}</TableCompStyled>
    );
}