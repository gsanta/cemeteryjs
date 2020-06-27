
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './core/gui/App';
import { AppContext } from './core/gui/Context';
import { Editor } from './core/Editor';
import { initCemetery } from './game/cemetery';

export function createEditor(element: HTMLDivElement) {
    const editor = new Editor();
    (window as any).cemetery = initCemetery(editor.registry);
    
    ReactDOM.render(
        <AppContext.Provider value={{controllers: editor, registry: editor.registry}}>
            <App/>
        </AppContext.Provider>,
        element
    );
};