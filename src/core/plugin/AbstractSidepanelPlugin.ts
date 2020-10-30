import { UI_Panel, UI_Region } from './UI_Panel';

export abstract class AbstractSidepanelPlugin extends UI_Panel {
    region = UI_Region.Sidepanel;
}