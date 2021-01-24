import { IToolAdapter } from "../../IToolAdapter";
import { Bab_EngineFacade } from "./Bab_EngineFacade";


export class Bab_ToolAdapter implements IToolAdapter {
    private engineFacade: Bab_EngineFacade;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;
    }

    selectTool(toolType: string) {
        this.engineFacade.toolService.setSelectedTool(toolType);
    }

    getSelectedTool(): string {
        return this.engineFacade.toolService.getSelectedTool().toolType;
    }
}