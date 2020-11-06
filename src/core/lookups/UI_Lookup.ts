import { CanvasLookup } from "./CanvasLookup";
import { PanelHelper } from "./PanelHelper";


export class UI_Lookup {

    helper: PanelHelper;
    canvas: CanvasLookup;

    constructor() {
        this.helper = new PanelHelper();
        this.canvas = new CanvasLookup();
    }
}