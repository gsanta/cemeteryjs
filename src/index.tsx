
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Editor } from './core/Editor';
import { initCemetery } from './game/cemetery';
import { AppContext } from './core/ui_components/react/Context';
import { App } from './core/ui_components/react/App';

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