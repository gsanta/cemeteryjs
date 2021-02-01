import { EngineEventAdapter } from "../controller/EngineEventAdapter";
import { PointerHandler } from "../controller/PointerHandler";
import { IEngineFacade } from "../engine/IEngineFacade";
import { Camera3D } from "../models/misc/camera/Camera3D";
import { Registry } from "../Registry";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";
import { UI_Region } from "./UI_Panel";

export abstract class Canvas3dPanel<D> extends AbstractCanvasPanel<D> {
    // TODO find a better place
    engine: IEngineFacade;
    
    protected engineEventAdapter: EngineEventAdapter<D>

    constructor(registry: Registry, region: UI_Region, id: string, displayName: string) {
        super(registry, region, id, displayName);
    }

    setCamera(camera: Camera3D) {
        super.setCamera(camera);

    }
}