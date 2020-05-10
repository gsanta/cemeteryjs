import * as React from 'react';
import { Editor } from '../../editor/Editor';
import { Registry } from '../../editor/Registry';

export interface AppContextType {
    controllers: Editor;
    registry: Registry;
}

export const AppContext = React.createContext<AppContextType>(undefined);