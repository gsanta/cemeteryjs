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

            if (!this.pressedKey) {
                return;
            }

            console.log('check inputs');

            var camera = this.camera;

            var speed = camera._computeLocalCameraSpeed() / 2;

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

    private removeEvents() {

    }

    private handleKeyDown(e: KeyboardEvent) {
        this.pressedKey = e.keyCode;
        // switch(e.keyCode) {
        //     case KeyboardInput.LEFT:
        //         this.pressedKey = Key
        //         console.log('left')
        //         break;
        //     case KeyboardInput.RIGHT:
        //         console.log('right');
        //         break;
        // }
    }

    private handleKeyUp(e: KeyboardEvent) {
        this.pressedKey = null;
        // switch(e.keyCode) {
        //     case KeyboardInput.LEFT:
        //         console.log('left')
        //         break;
        //     case KeyboardInput.RIGHT:
        //         console.log('right');
        //         break;
        // }
    }
}