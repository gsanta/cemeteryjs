import { ZoomTool } from "./ZoomTool";
import { ServiceLocator } from "../ServiceLocator";
import { Stores } from "../../stores/Stores";
import { DeleteTool } from "./DeleteTool";
import { PointerTool } from "./PointerTool";
import { ToolType } from "./Tool";
import { PathTool } from "./PathTool";
import { RectangleTool } from "./RectangleTool";
import { SelectTool } from "./SelectTool";
import { CameraRotationTool } from "./CameraRotationTool";

export class ToolService {
    zoom: ZoomTool;
    delete: DeleteTool;
    pointer: PointerTool;
    path: PathTool;
    rectangle: RectangleTool;
    select: SelectTool;
    cameraRotate: CameraRotationTool;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {

        this.zoom = new ZoomTool(getServices, getStores);
        this.delete = new DeleteTool(getServices, getStores);
        this.pointer = new PointerTool(getServices, getStores, ToolType.Pointer);
        this.path = new PathTool(getServices, getStores);
        this.rectangle = new RectangleTool(getServices, getStores);
        this.select = new SelectTool(getServices, getStores);
        this.cameraRotate = new CameraRotationTool(getServices, getStores);
    }
}