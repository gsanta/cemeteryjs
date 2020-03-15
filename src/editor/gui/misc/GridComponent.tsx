import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../styles';
import { withCommitOnChange } from '../forms/decorators/withCommitOnChange';

const GridStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export interface GridProps {
    onChange(index: number): void;
    value: number;
    markedValues: number[];
    isReversed: boolean;
}

export class GridComponent extends React.Component<GridProps> {
    render(): JSX.Element {
        const gridItems = this.renderGridItems();

        return <GridStyled>{gridItems}</GridStyled>
    }

    private renderGridItems(): JSX.Element[] {
        const items: JSX.Element[] = [];
        let start = this.props.isReversed ? 19 : 0;
        const end = this.props.isReversed ? 0 : 19;
        const step = start < end ? 1 : -1;
        while (start !== end) {
            items.push(<GridItem key={start} marked={this.props.markedValues.includes(start)} active={start === this.props.value} index={start} onClick={(ind) => this.props.onChange(ind)}/>);
            start += step;
        }

        return items;
    }
}

const GridItemStyled = styled.div`
    border: 1px solid black;
    width: 15px;
    height: 15px;
    background: ${(props: {active: boolean, marked: boolean}) => props.active ? colors.textColor : props.marked ? colors.success : colors.grey4 };
    cursor: pointer;
`;

export interface GridItemProps {
    active: boolean;
    marked: boolean;
    onClick(ind: number): void;
    index: number;
}

function GridItem(props: GridItemProps) {
    return (
        <GridItemStyled draggable="true" {...props} onClick={() => props.onClick(props.index)}/>
    );
}

export const ConnectedGridComponent = withCommitOnChange<GridProps>(GridComponent);


