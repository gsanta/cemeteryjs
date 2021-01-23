import { PointerEventTypes } from "babylonjs";
import { Bab_EngineFacade } from "./Bab_EngineFacade";


export class Bab_PointerService {
    private engineFacade: Bab_EngineFacade;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;

        this.engineFacade.onReady(() => this.init());
    }

    private init() {
        const tools = this.engineFacade.toolService;

        this.engineFacade.scene.onPointerObservable.add((eventData) => {
            switch(eventData.type) {
                case PointerEventTypes.POINTERUP:
                    tools.selectedTool.up(eventData);
                break;
            }
        });
    }
}