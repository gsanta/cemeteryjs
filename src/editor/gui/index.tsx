
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './App';
import { AppContext } from './Context';
import { Editor } from '../Editor';

export function renderApp(element: HTMLDivElement) {
    const editor = new Editor();
    
    ReactDOM.render(
        <AppContext.Provider value={{controllers: editor, getServices: () => editor.services, getStores: () => editor.stores}}>
            <App/>
        </AppContext.Provider>,
        element
    );
};