import { _3DMoveTool } from "../../../core/engine/adapters/babylonjs/tools/Bab_MoveTool";
import { Registry } from "../../../core/Registry";


export class GameViewerModel {
    showBoundingBoxes: boolean = false;
    selectedTool: string = _3DMoveTool;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
}