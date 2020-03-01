
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './App';
import { AppContext } from './Context';
import { Editor } from '../Editor';
import { ServiceLocator } from '../ServiceLocator';
import { EventDispatcher } from '../common/EventDispatcher';

export function renderApp(element: HTMLDivElement) {
    const eventDispatcher = new EventDispatcher();
    ReactDOM.render(
        <AppContext.Provider value={{controllers: new Editor(eventDispatcher)}}>
            <App/>
        </AppContext.Provider>,
        element
    );
};