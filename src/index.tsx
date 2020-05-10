
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './core/gui/App';
import { AppContext } from './core/gui/Context';
import { Editor } from './core/Editor';

export function renderApp(element: HTMLDivElement) {
    const editor = new Editor();
    
    ReactDOM.render(
        <AppContext.Provider value={{controllers: editor, registry: editor.registry}}>
            <App/>
        </AppContext.Provider>,
        element
    );
};