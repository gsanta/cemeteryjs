import { ICameraInput, UniversalCamera, Vector3 } from 'babylonjs';

export enum KeyboardInput {
    UP = 38,
    DOWN = 40,
    LEFT = 37,
    RIGHT = 39
}

export class KeyboardCameraInput implements ICameraInput<any> {
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

            var speed = 0.2;

            const position = camera.position;
            const targetPosition = camera.getTarget();

            const diff = targetPosition.subtract(position);

            switch(this.pressedKey) {
                case KeyboardInput.LEFT:
                    camera.position.copyFromFloats(position.x - speed, position.y, position.z);
                    break;
                case KeyboardInput.RIGHT:
                    camera.position.copyFromFloats(position.x + speed, position.y, position.z);
                    break;
                case KeyboardInput.UP:
                    camera.position.copyFromFloats(position.x, position.y, position.z + speed);
                    break;
                case KeyboardInput.DOWN:
                    camera.position.copyFromFloats(position.x, position.y, position.z - speed);
                    break;
                    
            }

            camera.setTarget(position.add(diff));
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