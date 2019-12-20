import * as React from 'react';
import { ControllerFacade } from '../controllers/ControllerFacade';

export interface AppContextType {
    controllers: ControllerFacade;
}

export const AppContext = React.createContext<AppContextType>(undefined);