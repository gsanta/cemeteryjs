import { UI_Panel } from "../plugin/UI_Panel";

export class PanelHelper {
    private _dialogPanel: UI_Panel;
    private _sidebarPanels: UI_Panel[];
    private _panel1: UI_Panel;
    private _panel2: UI_Panel;

    setPanel1(uiPanel: UI_Panel) {
        this._panel1 = uiPanel;
    }

    getPanel1(): UI_Panel {
        return this._panel1;
    }

    setPanel2(uiPanel: UI_Panel) {
        this._panel2 = uiPanel;
    }

    getPanel2(): UI_Panel {
        return this._panel2;
    }

    setSidebarPanels(uiPanel: UI_Panel[]) {
        this._sidebarPanels = uiPanel;
    }

    getSidebarPanels(): UI_Panel[] {
        return this._sidebarPanels;
    }

    setDialogPanel(uiPanel: UI_Panel) {
        this._dialogPanel = uiPanel;
    }

    getDialogPanel(): UI_Panel {
        return this._dialogPanel;
    }
}