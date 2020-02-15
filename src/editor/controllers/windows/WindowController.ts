import { ITagService } from "./ITagService";
import { Tool } from "../canvases/svg/tools/Tool";
import { Camera } from "../canvases/svg/models/Camera";
import { CameraTool } from "../canvases/svg/tools/CameraTool";
import { ICamera } from "./ICamera";


export interface WindowController {
    tagService: ITagService;
    getActiveTool(): Tool;
    renderWindow();
    getCamera(): ICamera;
    getId(): string;
}