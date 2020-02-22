import * as React from 'react';
import { Controllers } from '../Controllers';

export interface AppContextType {
    controllers: Controllers;
}

export const AppContext = React.createContext<AppContextType>(undefined);