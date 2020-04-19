import { ICameraInput, UniversalCamera, Vector3 } from 'babylonjs';
import { RendererCamera } from './RendererCamera';

export enum KeyboardInput {
    UP = 38,
    DOWN = 40,
    LEFT = 37,
    RIGHT = 39
}

export class KeyboardCameraInput implements ICameraInput<any> {
    camera: RendererCamera;

    private element: HTMLElement;
    private pressedKey: KeyboardInput;
    private isCtrlPressed: boolean = false;

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
                    this.camera.moveLeft();
                    break;
                case KeyboardInput.RIGHT:
                    this.camera.moveRight();
                    break;
                case KeyboardInput.UP:
                    if (this.isCtrlPressed) {
                        this.camera.zoomOut();
                    } else {
                        this.camera.moveUp();
                    }
                    break;
                case KeyboardInput.DOWN:
                    if (this.isCtrlPressed) {
                        this.camera.zoomIn(5);
                    } else {
                        this.camera.moveDown();
                    }
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
        this.isCtrlPressed = e.ctrlKey;
    }

    private handleKeyUp(e: KeyboardEvent) {
        this.pressedKey = null;
        this.isCtrlPressed = e.ctrlKey;
    }
}