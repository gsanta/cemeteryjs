
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './gui/App';

export function renderApp(element: HTMLDivElement) {
    ReactDOM.render(
        React.createElement(App, null),
        element
    );
};