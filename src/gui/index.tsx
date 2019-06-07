
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { App } from './App';

export function render() {
    ReactDom.render(
        <App/>,
        document.getElementsByTagName('body')[0]
    );
}

render();