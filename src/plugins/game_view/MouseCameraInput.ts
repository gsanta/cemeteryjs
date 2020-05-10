

import { ICameraInput, UniversalCamera, Vector3 } from 'babylonjs';
import { debounce } from '../../misc/Functions';

export enum MouseInput {
    WHEEL_DOWN = 'wheel-down',
    WHEEL_UP = 'wheel-up'
}

export class MouseCameraInput implements ICameraInput<any> {
    camera: UniversalCamera;

    private element: HTMLElement;
    private mouseInput: MouseInput;
    private stopWheelingDebounced: Function;

    constructor() {
        this.handleWheel = this.handleWheel.bind(this);
        this.stopWheeling = this.stopWheeling.bind(this);
        this.stopWheelingDebounced = debounce(this.stopWheeling, 10);
    }

    getTypeName(): string {
        return 'default-mouse-camera';
    }

    getSimpleName(): string {
        return 'mouse';
    }

    getClassName(): any {
        return '';
    }

    attachControl(element: HTMLElement, noPreventDefault?: boolean): void {
        this.element = element;
        this.registerEvents();
    }

    detachControl(element: HTMLElement): void {
        console.log('detachcontrol called')
    } 

    checkInputs(): void {
        if (!this.mouseInput) {
            return;
        }

        var camera = this.camera;

        var speed = camera._computeLocalCameraSpeed() / 2;

        console.log(camera.position);

        switch(this.mouseInput) {
            case MouseInput.WHEEL_DOWN:
                if (camera.position.y < 150) {
                    camera._localDirection.copyFromFloats(0, 0, -speed);
                    this.moveCamera();
                }
                break;
            case MouseInput.WHEEL_UP:
                if (camera.position.y > 50) {
                    camera._localDirection.copyFromFloats(0, 0, speed);
                    this.moveCamera();
                }
                break;
        }

    }

    private moveCamera() {
        this.camera.getViewMatrix().invertToRef(this.camera._cameraTransformMatrix);
        Vector3.TransformNormalToRef(this.camera._localDirection, this.camera._cameraTransformMatrix, this.camera._transformedDirection);
        this.camera.cameraDirection.addInPlace(this.camera._transformedDirection);
    }

    private registerEvents() {
        this.element.addEventListener('wheel', this.handleWheel);
    }

    private removeEvents() {

    }

    private handleWheel(e: WheelEvent) {
        if (e.deltaY < 0) {
            this.mouseInput = MouseInput.WHEEL_UP;
        } else {
            this.mouseInput = MouseInput.WHEEL_DOWN;
        }

        this.stopWheelingDebounced();
    }

    private stopWheeling() {
        this.mouseInput = null;
    }
}