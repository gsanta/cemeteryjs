import { UniversalCamera, Vector3, Scene, Engine, Matrix } from 'babylonjs';
import { KeyboardCameraInput } from './KeyboardCameraInput';
import { MouseCameraInput } from './MouseCameraInput';
import { Point } from '../../../misc/geometry/shapes/Point';
import { ICamera } from './ICamera';

const MIN_Y = 30;
const MAX_Y = 150;
const MOVE_SPEED = 0.2;

export class RendererCamera extends UniversalCamera implements ICamera {
    private targetPosition: Vector3;
    private startY: number;
    private origPosition = this.position.clone();
    private engine: Engine;
    private scene: Scene;

    constructor(engine: Engine, scene: Scene, canvas: HTMLCanvasElement, target: Vector3) {
        super('camera1', new Vector3(20, 50, -120), scene);
        this.engine = engine; 
        this.scene = scene;
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

    zoomToPosition(canvasPoint: Point, scale: number) {
        const screenPoint = this.canvasToScreenPoint(canvasPoint);
        const pointerRatio = new Point(screenPoint.x / this.engine.getRenderWidth(), screenPoint.y / this.engine.getRenderHeight());


        this.setTopLeftCorner(canvasPoint, scale);
        // this.moveBy(this.getRatioOfViewBox(this, pointerRatio).negate());
    }

    setTopLeftCorner(canvasPoint: Point, scale: number) {
        this.position = new Vector3(canvasPoint.x, this.position.y, canvasPoint.y);
    }

    moveBy(delta: Point) {
        console.log(this.position)
        this.position.x += (delta.x / 10);
        this.position.z -= (delta.y / 10);
    }

    moveTo(pos: Point) {
        this.position.x = (pos.x / 10);
        this.position.z = (pos.y / 10);
    }

    getScale(): number {
        return this.startY / this.position.y;
    }

    getTranslate(): Point {
        return null;
    }

    // screenToCanvasPoint(screenPoint: Point): Point {
    //     var viewport = this.viewport.toGlobal(this.engine.getRenderWidth(), this.engine.getRenderHeight());
    //     const mouseVec = new Vector3(screenPoint.x / this.engine.getRenderWidth(), screenPoint.y / this.engine.getRenderHeight(), 0);
    //     const canvasPoint = Vector3.Unproject(
    //         mouseVec,
    //         viewport.width,
    //         viewport.height,
    //         Matrix.Identity(), this.scene.getViewMatrix(),
    //         this.scene.getProjectionMatrix());

    //     return new Point(canvasPoint.x, canvasPoint.y);
    // }

    screenToCanvasPoint(screenPoint: Point): Point {
        var viewport = this.viewport.toGlobal(this.engine.getRenderWidth(), this.engine.getRenderHeight());

        var target = Vector3.Unproject(
                new Vector3(screenPoint.x, screenPoint.y, 0),
                viewport.width,
                viewport.height,
                Matrix.Identity(),
                this.scene.activeCamera.getViewMatrix(),
                this.scene.activeCamera.getProjectionMatrix()
        );
        

        target.x = this.scene.activeCamera.position.x - target.x;
        target.y = this.scene.activeCamera.position.y - target.y;
        target.z = this.scene.activeCamera.position.z - target.z;

        const canvasPoint = this._getZeroPlaneVector(this.scene.activeCamera.position, target);

        return new Point(canvasPoint.x, canvasPoint.z);
   }

    //usefull functions for dragging
   _getZeroPlaneVector(pos, rot)
   {
       return this._getHorizontalPlaneVector(0, pos, rot);
   };

   _getHorizontalPlaneVector(y, pos, rot)
   {
       if(!rot.y)
       {
           return null; // no solution, as it will never hit the zero plane
       }
       return new BABYLON.Vector3(
           pos.x - (pos.y - y) * rot.x / rot.y,
           1,
           pos.z - (pos.y - y) * rot.z / rot.y
       );
   };

    canvasToScreenPoint(canvasPoint: Point): Point {
        const v3 = Vector3.Project(
            new Vector3(canvasPoint.x, 1, canvasPoint.y), 
            Matrix.Identity(), 
            this.scene.getTransformMatrix(), 
            this.viewport.toGlobal(this.engine.getRenderWidth(), this.engine.getRenderHeight())
        );
        return new Point(v3.x, v3.y);
    }

    getCenterPoint(): Point {
        return new Point(0, 0);
    }

    
    // private getRatioOfViewBox(ratio: Point): Point {
    //     return camera.viewBox.getSize().mul(ratio.x, ratio.y);
    // }

    private zoomTemp() {
        this.getViewMatrix().invertToRef(this._cameraTransformMatrix);
        Vector3.TransformNormalToRef(this._localDirection, this._cameraTransformMatrix, this._transformedDirection);
        this.cameraDirection.addInPlace(this._transformedDirection);
    }
}