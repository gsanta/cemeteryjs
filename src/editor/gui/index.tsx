
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './App';
import { AppContext } from './Context';
import { Controllers } from '../Controllers';

export function renderApp(element: HTMLDivElement) {
    ReactDOM.render(
        <AppContext.Provider value={{controllers: new Controllers()}}>
            <App/>
        </AppContext.Provider>,
        element
    );
};