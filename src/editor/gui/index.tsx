
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './App';
import { AppContext } from './Context';
import { EditorFacade } from '../controllers/EditorFacade';

export function renderApp(element: HTMLDivElement) {
    ReactDOM.render(
        <AppContext.Provider value={{controllers: new EditorFacade()}}>
            <App/>
        </AppContext.Provider>,
        element
    );
};