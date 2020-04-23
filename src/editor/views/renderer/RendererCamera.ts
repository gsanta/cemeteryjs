import { Engine, Matrix, Scene, UniversalCamera, Vector3, ArcRotateCamera, Epsilon, Plane, Axis } from 'babylonjs';
import { Point } from '../../../misc/geometry/shapes/Point';
import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { ICamera } from './ICamera';
import { ServiceLocator } from '../../services/ServiceLocator';
import { Stores } from '../../stores/Stores';
import { PointerService } from '../../services/input/PointerService';

export class RendererCamera implements ICamera {
    // private targetPosition: Vector3;
    private startY: number;
    // private engine: Engine;
    // private scene: Scene;
    // private diff: Vector3;

    private viewBox: Rectangle;
    camera: ArcRotateCamera;
    private getServices: () => ServiceLocator;
    private getStores: () => Stores;
    private plane = Plane.FromPositionAndNormal(Vector3.Zero(), Axis.Y);
    private inertialPanning = BABYLON.Vector3.Zero();

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.getStores = getStores;
        const scene = this.getServices().game.getScene();
        this.camera = new ArcRotateCamera("Camera", -Math.PI / 2, 0, 150, Vector3.Zero(), scene);

        this.startY = this.camera.position.y;
        this.camera.inertia = 0.7;
        this.camera.lowerRadiusLimit = 10;
        this.camera.upperRadiusLimit = 1000;
        this.camera.upperBetaLimit = Math.PI / 2 - 0.1;
        this.camera.angularSensibilityX = this.camera.angularSensibilityY = 500;

        // this.engine = engine; 
        // this.scene = scene;
        // this.targetPosition = new Vector3(20, 0, -60);
        // this.startY = 50;
        // this.setTarget(this.targetPosition.clone());
        // this.diff = this.targetPosition.subtract(this.position);
        // this.diff.y = 0;
        // this.rotation.y = 0;
        // this.inputs.clear();
        // this.inputs.add(new KeyboardCameraInput());
        // this.inputs.add(new MouseCameraInput());
        // this.attachControl(canvas, true);
        // this.calcViewBox();
    }

    // const delta = zoomWheel(p,e,camera);
    // zooming(delta, scene, camera, plane, inertialPanning);

    pan(downPoint: Point, currentPoint: Point) {
        const down = this.screenToCanvasPoint(downPoint);
        const current = this.screenToCanvasPoint(currentPoint);

        panning(current, down, this.camera.inertia, this.inertialPanning);
    }

    zoom(scale?: number) {
        this.camera.position.y = this.startY / scale;  
    }

    zoomIn(zoomToPointer: boolean) {
        const delta = zoomWheel(this.camera, this.getServices().pointer);
        const scene = this.getServices().game.getScene();
        zooming(delta, scene, this.camera, this.plane, this.inertialPanning);
    }

    zoomOut(zoomToPointer: boolean) {
        const delta = zoomWheel(this.camera, this.getServices().pointer);
        const scene = this.getServices().game.getScene();
        zooming(delta, scene, this.camera, this.plane, this.inertialPanning);
    }

    moveBy(delta: Point) {
        this.camera.position.x += delta.x / this.getScreenToCanvasRatio();
        this.camera.position.z -= delta.y / this.getScreenToCanvasRatio();
    }

    moveTo(pos: Point) {
        this.camera.position.x = (pos.x / this.getScreenToCanvasRatio());
        this.camera.position.z = (pos.y / this.getScreenToCanvasRatio());
    }

    getScale(): number {
        return this.startY / this.camera.position.y;
    }

    getTranslate(): Point {
        return null;
    }

    screenToCanvasPoint(screenPoint: Point): Point {
        const scene = this.getServices().game.getScene();

        return getPosition(scene, this.camera, this.plane, screenPoint);
        // const scene = this.getServices().game.getScene();
        // const engine = this.getServices().game.getEngine();

        // var viewport = this.camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight());

        // var target = Vector3.Unproject(
        //         new Vector3(screenPoint.x, screenPoint.y, 0),
        //         viewport.width,
        //         viewport.height,
        //         Matrix.Identity(),
        //         scene.activeCamera.getViewMatrix(),
        //         scene.activeCamera.getProjectionMatrix()
        // );
        

        // target.x = scene.activeCamera.position.x - target.x;
        // target.y = scene.activeCamera.position.y - target.y;
        // target.z = scene.activeCamera.position.z - target.z;

        // const canvasPoint = this.getZeroPlaneVector(scene.activeCamera.position, target);

        // return new Point(canvasPoint.x, canvasPoint.z);
   }

    getCenterPoint(): Point {
        return this.getScreenBox().getBoundingCenter();
    }
    
    //usefull functions for dragging
    private getZeroPlaneVector(pos, rot) {
        return this.getHorizontalPlaneVector(0, pos, rot);
    };

    private getHorizontalPlaneVector(y, pos, rot) {
        if (!rot.y) {
            return null; // no solution, as it will never hit the zero plane
        }
        
        return new Vector3(
            pos.x - (pos.y - y) * rot.x / rot.y,
            1,
            pos.z - (pos.y - y) * rot.z / rot.y
        );
    };

    private getScreenToCanvasRatio(): number {
        return this.getScreenBox().getWidth() /  this.viewBox.getWidth()
    }

    private getScreenBox(): Rectangle {
        const engine = this.getServices().game.getEngine();
        return new Rectangle(new Point(0, 0), new Point(engine.getRenderWidth(), engine.getRenderHeight()));
    }

    private getCamera() {

    }
}

/** Get pos on plane.
 * @param {BABYLON.Scene} scene
 * @param {BABYLON.ArcRotateCamera} camera
 * @param {BABYLON.Plane} plane
 */
function getPosition(scene, camera, plane, screenPoint: Point) {
    const ray = scene.createPickingRay(screenPoint.x, screenPoint.y, Matrix.Identity(), camera, false);
    const distance = ray.intersectsPlane(plane);

    // not using this ray again, so modifying its vectors here is fine
    return distance !== null ?
        ray.origin.addInPlace(ray.direction.scaleInPlace(distance)) : null;
}

/** Return offsets for inertial panning given initial and current
 * pointer positions.
 * @param {BABYLON.Vector3} newPos
 * @param {BABYLON.Vector3} initialPos
 * @param {number} inertia
 * @param {BABYLON.Vector3} ref
 */
function panning(newPos: Point, initialPos: Point, inertia, ref) {
    const directionToZoomLocation = initialPos.subtract(newPos);
    const panningX = directionToZoomLocation.x * (1-inertia);
    const panningY = directionToZoomLocation.y * (1-inertia);
    ref.copyFromFloats(panningX, 0, panningY);
    return ref;
};

/** Get the wheel delta divided by the camera wheel precision.
 * @param {BABYLON.PointerInfoPre} p
 * @param {BABYLON.EventState} e
 * @param {BABYLON.ArcRotateCamera} camera
 */
function zoomWheel(camera: ArcRotateCamera, pointerService: PointerService) {
    return pointerService.wheelDiff / camera.wheelPrecision;
}

/** Zoom to pointer position. Zoom amount determined by delta.
 * @param {number} delta
 * @param {BABYLON.Scene} scene
 * @param {BABYLON.ArcRotateCamera} camera
 * @param {BABYLON.Plane} plane
 * @param {BABYLON.Vector3} ref
 */
function zooming(delta, scene, camera, plane, ref) {
    if (camera.radius - camera.lowerRadiusLimit < 1 && delta > 0) {
        return;
    } else if (camera.upperRadiusLimit - camera.radius < 1 && delta < 0) {
        return;
    }
    const inertiaComp = 1 - camera.inertia;
    if (camera.radius - (camera.inertialRadiusOffset + delta) / inertiaComp <
          camera.lowerRadiusLimit) {
        delta = (camera.radius - camera.lowerRadiusLimit) * inertiaComp - camera.inertialRadiusOffset;
    } else if (camera.radius - (camera.inertialRadiusOffset + delta) / inertiaComp >
               camera.upperRadiusLimit) {
        delta = (camera.radius - camera.upperRadiusLimit) * inertiaComp - camera.inertialRadiusOffset;
    }

    const zoomDistance = delta / inertiaComp;
    const ratio = zoomDistance / camera.radius;
    const vec = getPosition(scene, camera, plane);

    const directionToZoomLocation = vec.subtract(camera.target);
    const offset = directionToZoomLocation.scale(ratio);
    offset.scaleInPlace(inertiaComp);
    ref.addInPlace(offset);

    camera.inertialRadiusOffset += delta;
}

/** Rotate the camera
 * @param {BABYLON.Scene} scene
 * @param {BABYLON.Vector2} prvScreenPos
 * @param {BABYLON.ArcRotateCamera} camera
 */
function rotating(scene, camera, prvScreenPos) {
    const offsetX = scene.pointerX - prvScreenPos.x;
    const offsetY = scene.pointerY - prvScreenPos.y;
    prvScreenPos.copyFromFloats(scene.pointerX, scene.pointerY);
    changeInertialAlphaBetaFromOffsets(offsetX, offsetY, camera);
}

/** Modifies the camera's inertial alpha and beta offsets.
 * @param {number} offsetX
 * @param {number} offsetY
 * @param {BABYLON.ArcRotateCamera} camera
 */
function changeInertialAlphaBetaFromOffsets(offsetX, offsetY, camera) {
    const alphaOffsetDelta = offsetX / camera.angularSensibilityX;
    const betaOffsetDelta = offsetY / camera.angularSensibilityY;
    camera.inertialAlphaOffset -= alphaOffsetDelta;
    camera.inertialBetaOffset -= betaOffsetDelta;
}

/** Sets x y or z of passed in vector to zero if less than Epsilon.
 * @param {BABYLON.Vector3} vec
 */
function zeroIfClose(vec) {
    if (Math.abs(vec.x) < Epsilon) {
        vec.x = 0;
    }
    if (Math.abs(vec.y) < Epsilon) {
        vec.y = 0;
    }
    if (Math.abs(vec.z) < Epsilon) {
        vec.z = 0;
    }
}
