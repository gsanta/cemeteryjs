import { Engine, Matrix, Scene, UniversalCamera, Vector3 } from 'babylonjs';
import { Point } from '../../../misc/geometry/shapes/Point';
import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { ICamera } from './ICamera';
import { KeyboardCameraInput } from './KeyboardCameraInput';
import { MouseCameraInput } from './MouseCameraInput';

export class RendererCamera extends UniversalCamera implements ICamera {
    private targetPosition: Vector3;
    private startY: number;
    private engine: Engine;
    private scene: Scene;
    private diff: Vector3;

    private viewBox: Rectangle;

    constructor(engine: Engine, scene: Scene, canvas: HTMLCanvasElement, target: Vector3) {
        super('camera1', new Vector3(20, 50, -120), scene);
        this.engine = engine; 
        this.scene = scene;
        this.targetPosition = new Vector3(20, 0, -60);
        this.startY = 50;
        this.setTarget(this.targetPosition.clone());
        this.diff = this.targetPosition.subtract(this.position);
        this.diff.y = 0;
        this.rotation.y = 0;
        this.inputs.clear();
        this.inputs.add(new KeyboardCameraInput());
        this.inputs.add(new MouseCameraInput());
        this.attachControl(canvas, true);
        this.calcViewBox();
    }

    zoom(scale?: number) {
        this.position.y = this.startY / scale;  
    }

    zoomToPosition(canvasPoint: Point, scale: number) {
        const y = this.startY / scale;
        const screenSize = new Point(this.engine.getRenderWidth(), this.engine.getRenderHeight());
        const screenPoint = this.canvasToScreenPoint(canvasPoint);
        const pointerRatio = new Point(0.5 - screenPoint.x / screenSize.x, 0.5 - screenPoint.y / screenSize.y);


        this.position.y = y;
        this.setCenter(canvasPoint);
        this.calcViewBox();
        const moveBy = this.getRatioOfViewBox(pointerRatio);
        this.position.x += moveBy.x;
        this.position.z += moveBy.y
    }

    moveBy(delta: Point) {
        this.position.x += delta.x / this.getScreenToCanvasRatio();
        this.position.z -= delta.y / this.getScreenToCanvasRatio();
    }

    moveTo(pos: Point) {
        this.position.x = (pos.x / this.getScreenToCanvasRatio());
        this.position.z = (pos.y / this.getScreenToCanvasRatio());
    }

    getScale(): number {
        return this.startY / this.position.y;
    }

    getTranslate(): Point {
        return null;
    }

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

        const canvasPoint = this.getZeroPlaneVector(this.scene.activeCamera.position, target);

        return new Point(canvasPoint.x, canvasPoint.z);
   }

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
        return this.getScreenBox().getBoundingCenter();
    }
    
    private setCenter(canvasPoint: Point) {
        this.calcViewBox();
        const center = new Point(this.engine.getRenderWidth() / 2, this.engine.getRenderHeight() / 2);
        const canvasCenter = this.screenToCanvasPoint(center); 

        const diff = new Vector3(canvasCenter.x, 0, canvasCenter.y).subtract(new Vector3(canvasPoint.x, 0, canvasPoint.y));
        this.position = this.position.subtract(diff);
    }
    
    //usefull functions for dragging
    private getZeroPlaneVector(pos, rot) {
        return this.getHorizontalPlaneVector(0, pos, rot);
    };

    private getHorizontalPlaneVector(y, pos, rot) {
        if (!rot.y) {
            return null; // no solution, as it will never hit the zero plane
        }
        
        return new BABYLON.Vector3(
            pos.x - (pos.y - y) * rot.x / rot.y,
            1,
            pos.z - (pos.y - y) * rot.z / rot.y
        );
    };

    private calcViewBox() {
        const screenBox = new Rectangle(new Point(0, 0), new Point(this.engine.getRenderWidth(), this.engine.getRenderHeight()));
        this.viewBox = new Rectangle(
            this.screenToCanvasPoint(screenBox.topLeft),
            this.screenToCanvasPoint(screenBox.bottomRight)
        )
    }

    private getRatioOfViewBox(ratio: Point): Point {
        return this.viewBox.getSize().mul(ratio.x, ratio.y);
    }

    private getScreenToCanvasRatio(): number {
        return this.getScreenBox().getWidth() /  this.viewBox.getWidth()
    }

    private getScreenBox(): Rectangle {
        return new Rectangle(new Point(0, 0), new Point(this.engine.getRenderWidth(), this.engine.getRenderHeight()));
    }
}