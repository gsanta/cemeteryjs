import { GizmoHandler } from "../../../modules/scene_editor/main/GizmoHandler";
import { EngineEventAdapter } from "../../controller/EngineEventAdapter";
import { IEngineFacade } from "../../engine/IEngineFacade";
import { Camera3D } from "../misc/camera/Camera3D";
import { AbstractGameObj } from "../objs/AbstractGameObj";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";

export abstract class Canvas3dPanel extends AbstractCanvasPanel<AbstractGameObj> {
    engine: IEngineFacade;
    
    protected engineEventAdapter: EngineEventAdapter<AbstractGameObj>
    gizmoHandler: GizmoHandler;

    setCamera(camera: Camera3D) {
        super.setCamera(camera);

    }
}