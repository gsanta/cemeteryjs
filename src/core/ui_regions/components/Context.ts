import * as React from 'react';
import { Editor } from '../../Editor';
import { Registry } from '../../Registry';

export interface AppContextType {
    controllers: Editor;
    registry: Registry;
}

export const AppContext = React.createContext<AppContextType>(undefined);