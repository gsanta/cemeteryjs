import { ITagService } from "./ITagService";
import { Tool } from "./canvas/tools/Tool";
import { Camera } from "./canvas/models/Camera";
import { CameraTool } from "./canvas/tools/CameraTool";
import { ICamera } from "./ICamera";
import { IPointerService } from "./services/IPointerService";


export interface WindowController {
    tagService: ITagService;
    pointerService: IPointerService;
    getActiveTool(): Tool;
    renderWindow();
    getCamera(): ICamera;
    getId(): string;
}