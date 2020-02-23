
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './App';
import { AppContext } from './Context';
import { Editor } from '../Editor';

export function renderApp(element: HTMLDivElement) {
    ReactDOM.render(
        <AppContext.Provider value={{controllers: new Editor()}}>
            <App/>
        </AppContext.Provider>,
        element
    );
};