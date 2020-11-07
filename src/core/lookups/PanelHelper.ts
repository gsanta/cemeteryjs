import { AbstractCanvasPanel } from "../plugin/AbstractCanvasPanel";
import { UI_Panel } from "../plugin/UI_Panel";

export class PanelHelper {
    private _dialogPanel: UI_Panel;
    private _sidebarPanels: UI_Panel[];
    private _panel1: AbstractCanvasPanel;
    private _panel2: AbstractCanvasPanel;

    // TODO find a better place
    hoveredPanel: AbstractCanvasPanel;

    setPanel1(uiPanel: AbstractCanvasPanel) {
        this._panel1 = uiPanel;
    }

    getPanel1(): AbstractCanvasPanel {
        return this._panel1;
    }

    setPanel2(uiPanel: AbstractCanvasPanel) {
        this._panel2 = uiPanel;
    }

    getPanel2(): AbstractCanvasPanel {
        return this._panel2;
    }

    setSidebarPanels(uiPanels: UI_Panel[]) {
        this._sidebarPanels = uiPanels;
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