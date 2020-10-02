import { UI_Plugin, UI_Region } from './UI_Plugin';

export abstract class AbstractSidepanelPlugin extends UI_Plugin {
    region = UI_Region.Sidepanel;
}