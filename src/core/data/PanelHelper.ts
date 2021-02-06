import { AbstractCanvasPanel } from "../models/modules/AbstractCanvasPanel";
import { UI_Panel } from "../models/UI_Panel";

export class PanelHelper {
    private _dialogPanel: UI_Panel;
    private _sidebarPanels: UI_Panel[] = [];
    private _panel1: AbstractCanvasPanel<any>;
    private _panel2: AbstractCanvasPanel<any>;

    // TODO find a better place
    hoveredPanel: AbstractCanvasPanel<any>;

    setPanel1(uiPanel: AbstractCanvasPanel<any>) {
        this._panel1 = uiPanel;
    }

    getPanel1(): AbstractCanvasPanel<any> {
        return this._panel1;
    }

    setPanel2(uiPanel: AbstractCanvasPanel<any>) {
        this._panel2 = uiPanel;
    }

    getPanel2(): AbstractCanvasPanel<any> {
        return this._panel2;
    }

    setSidebarPanels(uiPanels: UI_Panel[]) {
        this._sidebarPanels = uiPanels;
    }

    getSidebarPanels(): UI_Panel[] {
        return this._sidebarPanels || [];
    }

    setDialogPanel(uiPanel: UI_Panel) {
        this._dialogPanel = uiPanel;
        this._dialogPanel && this._dialogPanel.open();
    }

    getDialogPanel(): UI_Panel {
        return this._dialogPanel;
    }
}