import { IEngineFacade } from "../engine/IEngineFacade";
import { Camera3D } from "../models/misc/camera/Camera3D";
import { AbstractCanvasPanel } from "./AbstractCanvasPanel";


export abstract class Canvas3dPanel<D> extends AbstractCanvasPanel<D> {
    // TODO find a better place
    engine: IEngineFacade;
    
    setCamera(camera: Camera3D) {
        super.setCamera(camera);
    }
}