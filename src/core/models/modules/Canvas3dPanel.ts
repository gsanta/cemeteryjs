import { EngineEventAdapter } from "../../controller/EngineEventAdapter";
import { IEngineFacade } from "../../engine/IEngineFacade";
import { Camera3D } from "../misc/camera/Camera3D";
import { Registry } from "../../Registry";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";
import { UI_Region } from "../UI_Panel";
import { IObj } from "../objs/IObj";

export abstract class Canvas3dPanel extends AbstractCanvasPanel<IObj> {
    // TODO find a better place
    engine: IEngineFacade;
    
    protected engineEventAdapter: EngineEventAdapter<IObj>

    constructor(registry: Registry, region: UI_Region, id: string, displayName: string) {
        super(registry, region, id, displayName);
    }

    setCamera(camera: Camera3D) {
        super.setCamera(camera);

    }
}