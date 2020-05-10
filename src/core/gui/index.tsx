
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './App';
import { AppContext } from './Context';
import { Editor } from '../../editor/Editor';

export function renderApp(element: HTMLDivElement) {
    const editor = new Editor();
    
    ReactDOM.render(
        <AppContext.Provider value={{controllers: editor, registry: editor.registry}}>
            <App/>
        </AppContext.Provider>,
        element
    );
};