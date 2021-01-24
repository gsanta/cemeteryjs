import { IEngineTool } from "../../IEngineTool";
import { Bab_EngineFacade } from "./Bab_EngineFacade";
import { Bab_MoveTool } from "./tools/Bab_MoveTool";
import { Bab_RotationTool } from "./tools/Bab_RotationTool";
import { Bab_ScaleTool } from "./tools/Bab_ScaleTool";


export class Bab_ToolService {
    private readonly engineFacade: Bab_EngineFacade;
    tools: IEngineTool[] = [];

    private moveTool: Bab_MoveTool;
    private scaleTool: Bab_ScaleTool;
    private rotationTool: Bab_RotationTool;
    private selectedTool: IEngineTool;

    constructor(engineFacade: Bab_EngineFacade) {
        this.engineFacade = engineFacade;

        this.moveTool = new Bab_MoveTool(this.engineFacade);
        this.scaleTool = new Bab_ScaleTool(this.engineFacade);
        this.rotationTool = new Bab_RotationTool(this.engineFacade);
        this.tools.push(
            this.moveTool,
            this.scaleTool,
            this.rotationTool
        );

        this.setSelectedTool(this.moveTool.toolType);
    }

    setSelectedTool(toolType: string) {
        if (this.selectedTool) {
            this.selectedTool.deselect();
        }

        this.selectedTool = this.tools.find(tool => tool.toolType === toolType);
    }

    getSelectedTool() {
        return this.selectedTool;
    }
} 