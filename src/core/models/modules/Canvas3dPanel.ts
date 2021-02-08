import { EngineEventAdapter } from "../../controller/EngineEventAdapter";
import { IEngineFacade } from "../../engine/IEngineFacade";
import { Camera3D } from "../misc/camera/Camera3D";
import { IObj } from "../objs/IObj";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";

export abstract class Canvas3dPanel extends AbstractCanvasPanel<IObj> {
    // TODO find a better place
    engine: IEngineFacade;
    
    protected engineEventAdapter: EngineEventAdapter<IObj>

    setCamera(camera: Camera3D) {
        super.setCamera(camera);

    }
}