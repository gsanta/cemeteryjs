import { ZoomTool } from "./common/tools/ZoomTool";
import { DeleteTool } from "./common/tools/DeleteTool";
import { PointerTool } from "./common/tools/PointerTool";
import { ToolType, Tool } from "./common/tools/Tool";
import { PathTool } from "./common/tools/PathTool";
import { RectangleTool } from "./common/tools/RectangleTool";
import { SelectTool } from "./common/tools/SelectTool";
import { CameraRotationTool } from "./common/tools/CameraRotationTool";
import { Registry } from "../core/Registry";
import { GamepadTool } from "../core/services/GamepadService";
import { PanTool } from "./common/tools/PanTool";
import { DragAndDropTool } from "./common/tools/DragAndDropTool";
import { JoinTool } from "./common/tools/JoinTool";

export class Tools {
    zoom: ZoomTool;
    delete: DeleteTool;
    pointer: PointerTool;
    path: PathTool;
    rectangle: RectangleTool;
    select: SelectTool;
    cameraRotate: CameraRotationTool;
    pan: PanTool;
    dragAndDrop: DragAndDropTool;
    join: JoinTool;

    tools: Tool[] = [];

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.zoom = new ZoomTool(this.registry);
        this.delete = new DeleteTool(this.registry);
        this.pointer = new PointerTool(ToolType.Pointer, registry);
        this.path = new PathTool(this.registry);
        this.rectangle = new RectangleTool(this.registry);
        this.select = new SelectTool(this.registry);
        this.cameraRotate = new CameraRotationTool(this.registry);
        this.pan = new PanTool(this.registry);
        this.dragAndDrop = new DragAndDropTool(this.registry);
        this.join = new JoinTool(this.registry);

        this.tools.push(this.zoom);
        this.tools.push(this.delete);
        this.tools.push(this.pointer);
        this.tools.push(this.path);
        this.tools.push(this.rectangle);
        this.tools.push(this.select);
        this.tools.push(this.cameraRotate);
        this.tools.push(this.gamepad);
        this.tools.push(this.pan);
        this.tools.push(this.dragAndDrop);
        this.tools.push(this.join);
    }

    getByType(toolType: ToolType) {
        return this.tools.find(tool => tool.type === toolType);
    }
}