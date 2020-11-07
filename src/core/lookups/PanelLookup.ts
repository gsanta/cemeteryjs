import { UI_Panel } from "../plugin/UI_Panel";


export class PanelLookup {
    private panels: Map<string, UI_Panel> = new Map();

    registerPanel(panel: UI_Panel) {
        this.panels.set(panel.id, panel);
    }

    getPanel(id: string) {
        return this.panels.get(id);
    }
}