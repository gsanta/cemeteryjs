import * as React from 'react';
import { Editor } from '../Editor';

export interface AppContextType {
    controllers: Editor;
}

export const AppContext = React.createContext<AppContextType>(undefined);