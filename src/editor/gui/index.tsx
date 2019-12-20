
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './App';
import { AppContext } from './Context';
import { ControllerFacade } from '../controllers/ControllerFacade';

export function renderApp(element: HTMLDivElement) {
    ReactDOM.render(
        <AppContext.Provider value={{controllers: new ControllerFacade()}}>
            <App/>
        </AppContext.Provider>,
        element
    );
};