import { UniversalCamera, Vector3, Scene } from 'babylonjs';
import { KeyboardCameraInput } from './KeyboardCameraInput';
import { MouseCameraInput } from './MouseCameraInput';

export class EditorCamera extends UniversalCamera {
    private static INITIAL_POS =  new Vector3(100, 50, 0);

    constructor(scene: Scene, canvas: HTMLCanvasElement, target: Vector3) {
        super('camera1', new Vector3(0, 150, 0), scene);
        this.setTarget(new Vector3(0, 0, 0));
        this.rotation.y = 0;
        this.inputs.clear();
        this.inputs.add(new KeyboardCameraInput());
        this.inputs.add(new MouseCameraInput());
        this.attachControl(canvas, true);
    }
}