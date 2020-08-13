

import * as React from 'react';
import { UI_Table } from '../../elements/UI_Table';
import styled from 'styled-components';
import { colors } from '../styles';

const TableCompStyled = styled.div`
    .ce-table-row {
        display: flex;
        justify-content: space-between;
    
        &.ce-table-header { 
            .ce-table-column {
                background: ${colors.panelBackgroundLight};
                width: 100%;
                margin: 1px;
                text-align: center;
                font-weight: bold;
            }
        }
    }

    .ce-table-row-group {
        font-weight: bold;
        margin: 1px;
        padding-left: 5px;
        border-bottom: 1px solid ${colors.textColor};
    }

    .ce-table-column:nth-child(1) {}
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