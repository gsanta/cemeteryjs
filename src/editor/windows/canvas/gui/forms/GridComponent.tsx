import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../../../gui/styles';
import { withCommitOnChange } from '../../../../gui/forms/decorators/withCommitOnChange';

const GridStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export interface GridProps {
    onChange(index: number): void;
    value: number;
    markedValues: number[];
}

export class GridComponent extends React.Component<GridProps> {
    render(): JSX.Element {
        const gridItems = this.renderGridItems();

        return <GridStyled>{gridItems}</GridStyled>
    }

    private renderGridItems(): JSX.Element[] {
        const items: JSX.Element[] = [];
        for (let i = 19; i >= 0; i--) {
            items.push(<GridItem marked={this.props.markedValues.includes(i)} active={i === this.props.value} onClick={() => this.props.onChange(i)}/>);
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
    onClick(): void;
}

function GridItem(props: GridItemProps) {
    return (
        <GridItemStyled draggable="true" {...props} onClick={props.onClick}/>
    );
}

export const ConnectedGridComponent = withCommitOnChange<GridProps>(GridComponent);


