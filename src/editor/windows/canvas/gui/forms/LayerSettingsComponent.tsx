import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../../../gui/styles';
import { withCommitOnChange } from '../../../../gui/forms/decorators/withCommitOnChange';

const GridStyled = styled.div`
    border: 1px solid black;
    width: 15px;
    height: 15px;
    background: ${(props: {active: boolean}) => props.active ? colors.textColor : colors.grey4 };
    cursor: pointer;
`;

export interface GridItemProps {
    active: boolean;
    onClick(): void;
}

function GridItem(props: GridItemProps) {

    return (
        <GridStyled draggable="true" {...props} onClick={props.onClick}/>
    );
}

const LayerStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export interface LayerSettingsProp {
    onChange(index: number): void;
    value: number;
}

export class LayerSettingsComponent extends React.Component<LayerSettingsProp> {
    render(): JSX.Element {
        const gridItems = this.renderGridItems();

        return (
            <LayerStyled>
                {gridItems}
            </LayerStyled>
        )
    }

    private renderGridItems(): JSX.Element[] {
        const items: JSX.Element[] = [];
        for (let i = 19; i >= 0; i--) {
            items.push(<GridItem active={i === this.props.value} onClick={() => this.props.onChange(i)}/>);
        }

        return items;
    }
}

export const ConnectedLayerSettingsComponent = withCommitOnChange<LayerSettingsProp>(LayerSettingsComponent);


