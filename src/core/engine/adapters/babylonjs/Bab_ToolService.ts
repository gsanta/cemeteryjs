import { IEngineTool } from "../../IEngineTool";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { Bab_MoveTool } from "./tools/Bab_MoveTool";
import { Bab_RotationTool } from "./tools/Bab_RotationTool";
import { Bab_ScaleTool } from "./tools/Bab_ScaleTool";


export class Bab_ToolService {
    private readonly engineFacade: Bab_EngineFacade;

    moveTool: Bab_MoveTool;
    scaleTool: Bab_ScaleTool;
    rotationTool: Bab_RotationTool;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;

        this.moveTool = new Bab_MoveTool(this.engineFacade);
        this.scaleTool = new Bab_ScaleTool(this.engineFacade);
        this.rotationTool = new Bab_RotationTool(this.engineFacade);
        this.selectedTool = this.rotationTool;
    }

    selectedTool: IEngineTool;
} 