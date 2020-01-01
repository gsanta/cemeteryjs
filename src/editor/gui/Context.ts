import * as React from 'react';
import { EditorFacade } from '../controllers/EditorFacade';

export interface AppContextType {
    controllers: EditorFacade;
}

export const AppContext = React.createContext<AppContextType>(undefined);