import * as React from 'react';
import { Editor } from '../Editor';
import { ServiceLocator } from '../services/ServiceLocator';
import { Stores } from '../stores/Stores';

export interface AppContextType {
    controllers: Editor;
    getServices(): ServiceLocator;
    getStores(): Stores;
}

export const AppContext = React.createContext<AppContextType>(undefined);