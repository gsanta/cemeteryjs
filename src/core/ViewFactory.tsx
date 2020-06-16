import { AbstractPlugin } from './AbstractPlugin';
import { Registry } from './Registry';

export interface ViewFactory {
    name: string;
    getWindowController(registry: Registry): AbstractPlugin;
    renderWindowComponent(): JSX.Element;
    renderToolbarComponent(): JSX.Element;
}

export interface CanvasToolsProps {
    title: string;
    body: JSX.Element | JSX.Element[];
}