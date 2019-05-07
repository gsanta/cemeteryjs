
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Canvas } from './Canvas';
import styled from 'styled-components';

const App = styled.div`
    width: calc(100% - 300px);
    height: 100%;
`;

export function render() {
    ReactDom.render(
        <App><Canvas/></App>,
        document.getElementsByTagName('body')[0]
    );
}

render();