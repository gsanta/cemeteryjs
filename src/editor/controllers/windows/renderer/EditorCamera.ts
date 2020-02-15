import { UniversalCamera, Vector3, Scene } from 'babylonjs';
import { KeyboardCameraInput } from './KeyboardCameraInput';
import { MouseCameraInput } from './MouseCameraInput';
import { Point } from '../../../../misc/geometry/shapes/Point';
import { ICamera } from '../ICamera';

const MIN_Y = 30;
const MAX_Y = 150;
const MOVE_SPEED = 0.2;

export class EditorCamera extends UniversalCamera implements ICamera {
    private targetPosition: Vector3;
    private startY: number;

    constructor(scene: Scene, canvas: HTMLCanvasElement, target: Vector3) {
        super('camera1', new Vector3(20, 50, -120), scene);
        this.targetPosition = new Vector3(20, 0, -60);
        this.startY = 50;
        this.setTarget(this.targetPosition.clone());
        this.rotation.y = 0;
        this.inputs.clear();
        this.inputs.add(new KeyboardCameraInput());
        this.inputs.add(new MouseCameraInput());
        this.attachControl(canvas, true);
    }

    zoomIn(speed2: number) {
        this.zoom();
        // var speed = this._computeLocalCameraSpeed() / 2;

        // if (this.position.y < MAX_Y) {
            // this._localDirection.copyFromFloats(0, 0, -speed);
            // this.zoomTemp();
        // }
    }

    zoomOut() {
        var speed = this._computeLocalCameraSpeed() / 2;

        if (this.position.y > MIN_Y) {
            this._localDirection.copyFromFloats(0, 0, speed);
            this.zoomTemp();
        }
    }

    moveLeft() {
        this.moveWith(new Vector3(-MOVE_SPEED, 0, 0));
    }

    moveRight() {
        this.moveWith(new Vector3(MOVE_SPEED, 0, 0));
    }

    moveUp() {
        this.moveWith(new Vector3(0, 0, MOVE_SPEED));
    }

    moveDown() {
        this.moveWith(new Vector3(0, 0, -MOVE_SPEED));
    }

    private moveWith(delta: Vector3) {
        const position = this.position;
        
        this.position.copyFromFloats(position.x + delta.x, position.y + delta.y, position.z + delta.z);
        this.targetPosition.copyFromFloats(position.x + delta.x, position.y + delta.y, position.z + delta.z);

        this.setTarget(this.targetPosition.clone());
    }

    zoom(scale?: number) {
        this.position.y = this.startY / scale;  
    }

    moveBy(delta: Point) {
        this.position.x += (delta.x / 10);
        this.position.z -= (delta.y / 10);
    }

    getScale(): number {
        return this.startY / this.position.y;
    }

    screenToCanvasPoint(screenPoint: Point): Point {
        const scale = this.getScale();

        return screenPoint;
    }

    private zoomTemp() {
        this.getViewMatrix().invertToRef(this._cameraTransformMatrix);
        Vector3.TransformNormalToRef(this._localDirection, this._cameraTransformMatrix, this._transformedDirection);
        this.cameraDirection.addInPlace(this._transformedDirection);
    }
}