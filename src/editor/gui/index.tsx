
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './App';
import { AppContext } from './Context';
import { Editor } from '../Editor';
import { ServiceLocator } from '../ServiceLocator';

export function renderApp(element: HTMLDivElement) {
    const serviceLocator = new ServiceLocator();
    ReactDOM.render(
        <AppContext.Provider value={{controllers: new Editor(serviceLocator)}}>
            <App/>
        </AppContext.Provider>,
        element
    );
};