import { ZoomTool } from "./ZoomTool";
import { DeleteTool } from "./DeleteTool";
import { PointerTool } from "./PointerTool";
import { ToolType, Tool } from "./Tool";
import { PathTool } from "./PathTool";
import { RectangleTool } from "./RectangleTool";
import { SelectTool } from "./SelectTool";
import { CameraRotationTool } from "./CameraRotationTool";
import { Registry } from "../../Registry";
import { GamepadTool } from "./GamepadTool";
import { PanTool } from "./PanTool";

export class ToolService {
    zoom: ZoomTool;
    delete: DeleteTool;
    pointer: PointerTool;
    path: PathTool;
    rectangle: RectangleTool;
    select: SelectTool;
    cameraRotate: CameraRotationTool;
    gamepad: GamepadTool;
    pan: PanTool;

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
        this.gamepad = new GamepadTool(this.registry);
        this.pan = new PanTool(this.registry);

        this.tools.push(this.zoom);
        this.tools.push(this.delete);
        this.tools.push(this.pointer);
        this.tools.push(this.path);
        this.tools.push(this.rectangle);
        this.tools.push(this.select);
        this.tools.push(this.cameraRotate);
        this.tools.push(this.gamepad);
        this.tools.push(this.pan);
    }
}