import { ICameraInput, UniversalCamera, Vector3 } from 'babylonjs';

export enum KeyboardInput {
    UP = 38,
    DOWN = 40,
    LEFT = 37,
    RIGHT = 39
}

export class CustomCameraInput implements ICameraInput<any> {
    camera: UniversalCamera;

    private element: HTMLElement;
    private pressedKey: KeyboardInput;

    private allowedKeys = [KeyboardInput.UP, KeyboardInput.DOWN, KeyboardInput.LEFT, KeyboardInput.RIGHT];

    constructor() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    getTypeName(): string {
        return 'default-camera';
    }

    getSimpleName(): string {
        return 'default';
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
            if (this.allowedKeys.indexOf(this.pressedKey) === -1) {
                return;
            }

            var camera = this.camera;

            var speed = camera._computeLocalCameraSpeed() / 4;

            switch(this.pressedKey) {
                case KeyboardInput.LEFT:
                    camera._localDirection.copyFromFloats(-speed, 0, 0);
                    break;
                case KeyboardInput.RIGHT:
                    camera._localDirection.copyFromFloats(speed, 0, 0);
                    break;
                case KeyboardInput.UP:
                        camera._localDirection.copyFromFloats(0, speed, 0);
                    break;
                case KeyboardInput.DOWN:
                    camera._localDirection.copyFromFloats(0, -speed, 0);
                    break;
                
            }

            camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
            Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection);
            camera.cameraDirection.addInPlace(camera._transformedDirection);
    }

    private registerEvents() {
        this.element.addEventListener('keydown', this.handleKeyDown);
        this.element.addEventListener('keyup', this.handleKeyUp);
    }

    private handleKeyDown(e: KeyboardEvent) {
        this.pressedKey = e.keyCode;
    }

    private handleKeyUp(e: KeyboardEvent) {
        this.pressedKey = null;
    }
}