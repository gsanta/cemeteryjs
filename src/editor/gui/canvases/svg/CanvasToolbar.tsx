import * as React from 'react';
import styled from 'styled-components';

const CanvasToolbarStyled = styled.div`
    position: absolute;
    top: 5px;
    left: 20px;
    width: 200px;
    height: 30px;
    background: red;
`;

export class CanvasToolbar extends React.Component {


    render() {
        return (
            <CanvasToolbarStyled></CanvasToolbarStyled>
        )
    }
}