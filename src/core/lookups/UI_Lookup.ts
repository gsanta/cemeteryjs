import { CanvasLookup } from "./CanvasLookup";
import { PanelHelper } from "./PanelHelper";
import { PanelLookup } from "./PanelLookup";


export class UI_Lookup {

    helper: PanelHelper;
    canvas: CanvasLookup; 
    panel: PanelLookup;

    constructor() {
        this.helper = new PanelHelper();
        this.canvas = new CanvasLookup();
        this.panel = new PanelLookup();
    }
}