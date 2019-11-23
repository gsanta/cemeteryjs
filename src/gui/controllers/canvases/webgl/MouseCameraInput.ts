

import { ICameraInput, UniversalCamera, Vector3 } from 'babylonjs';
import { debounce } from '../../../../model/utils/Functions';

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
        // console.log('attachcontrol called');

        // element.addEventListener('keyup', (e: KeyboardEvent) => {

        //     switch(e.keyCode) {
        //         case KeyboardInput.LEFT:
        //             this.camera._localDirection
        //             console.log('left')
        //             break;
        //         case KeyboardInput.RIGHT:
        //             console.log('right');
        //             break;
        //     }
        // });
    }

    //detach control must deactivate your input and release all pointers, closures or event listeners
    detachControl(element: HTMLElement): void {
        console.log('detachcontrol called')
    } 

    //this optional function will get called for each rendered frame, if you want to synchronize your input to rendering,
    //no need to use requestAnimationFrame. It's a good place for applying calculations if you have to
    checkInputs(): void {
        // switch(this.pressedKey) {
        //     case KeyboardInput.LEFT:
        //         this.camera.position = 
        // }

            if (!this.mouseInput) {
                return;
            }

            console.log('check inputs');

            var camera = this.camera;

            var speed = camera._computeLocalCameraSpeed() / 2;

            switch(this.mouseInput) {
                case MouseInput.WHEEL_DOWN:
                    camera._localDirection.copyFromFloats(0, 0, -speed);
                    break;
                case MouseInput.WHEEL_UP:
                    camera._localDirection.copyFromFloats(0, 0, speed);
                    break;
            }

            camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
            Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection);
            camera.cameraDirection.addInPlace(camera._transformedDirection);
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