import { IToolAdapter } from "../../IToolAdapter";
import { Wrap_EngineFacade } from "./Wrap_EngineFacade";

export class Wrap_ToolAdapter implements IToolAdapter {
    private engineFacade: Wrap_EngineFacade;

    constructor(engineFacade: Wrap_EngineFacade) {
        this.engineFacade = engineFacade;
    }

    selectTool(toolType: string) {
        this.engineFacade.realEngine.tools.selectTool(toolType);
    }

    getSelectedTool(): string {
        return this.engineFacade.realEngine.tools.getSelectedTool();
    }
}