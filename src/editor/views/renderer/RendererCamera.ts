// import { Engine, Matrix, Scene, UniversalCamera, Vector3, ArcRotateCamera, Epsilon } from 'babylonjs';
// import { Point } from '../../../misc/geometry/shapes/Point';
// import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
// import { ICamera } from './ICamera';
// import { KeyboardCameraInput } from './KeyboardCameraInput';
// import { MouseCameraInput } from './MouseCameraInput';

// export class RendererCamera implements ICamera {
//     // private targetPosition: Vector3;
//     // private startY: number;
//     // private engine: Engine;
//     // private scene: Scene;
//     // private diff: Vector3;

//     private viewBox: Rectangle;
//     camera: ArcRotateCamera;

//     constructor(engine: Engine, scene: Scene, canvas: HTMLCanvasElement, target: Vector3) {
//         this.camera = new ArcRotateCamera("Camera", -Math.PI / 2, 0, 150, Vector3.Zero(), scene);
//         this.camera.inertia = 0.7;
//         this.camera.lowerRadiusLimit = 10;
//         this.camera.upperRadiusLimit = 1000;
//         this.camera.upperBetaLimit = Math.PI / 2 - 0.1;
//         this.camera.angularSensibilityX = this.camera.angularSensibilityY = 500;

//         // this.engine = engine; 
//         // this.scene = scene;
//         // this.targetPosition = new Vector3(20, 0, -60);
//         // this.startY = 50;
//         // this.setTarget(this.targetPosition.clone());
//         // this.diff = this.targetPosition.subtract(this.position);
//         // this.diff.y = 0;
//         // this.rotation.y = 0;
//         // this.inputs.clear();
//         // this.inputs.add(new KeyboardCameraInput());
//         // this.inputs.add(new MouseCameraInput());
//         // this.attachControl(canvas, true);
//         // this.calcViewBox();
//     }

//     const delta = zoomWheel(p,e,camera);
//     zooming(delta, scene, camera, plane, inertialPanning);


//     zoom(scale?: number) {
//         this.position.y = this.startY / scale;  
//     }

//     zoomToPosition(canvasPoint: Point, scale: number) {
//         const y = this.startY / scale;
//         const screenSize = new Point(this.engine.getRenderWidth(), this.engine.getRenderHeight());
//         const screenPoint = this.canvasToScreenPoint(canvasPoint);
//         const pointerRatio = new Point(0.5 - screenPoint.x / screenSize.x, 0.5 - screenPoint.y / screenSize.y);


//         this.position.y = y;
//         this.setCenter(canvasPoint);
//         this.calcViewBox();
//         const moveBy = this.getRatioOfViewBox(pointerRatio);
//         this.position.x += moveBy.x;
//         this.position.z += moveBy.y
//     }

//     moveBy(delta: Point) {
//         this.position.x += delta.x / this.getScreenToCanvasRatio();
//         this.position.z -= delta.y / this.getScreenToCanvasRatio();
//     }

//     moveTo(pos: Point) {
//         this.position.x = (pos.x / this.getScreenToCanvasRatio());
//         this.position.z = (pos.y / this.getScreenToCanvasRatio());
//     }

//     getScale(): number {
//         return this.startY / this.position.y;
//     }

//     getTranslate(): Point {
//         return null;
//     }

//     screenToCanvasPoint(screenPoint: Point): Point {
//         var viewport = this.viewport.toGlobal(this.engine.getRenderWidth(), this.engine.getRenderHeight());

//         var target = Vector3.Unproject(
//                 new Vector3(screenPoint.x, screenPoint.y, 0),
//                 viewport.width,
//                 viewport.height,
//                 Matrix.Identity(),
//                 this.scene.activeCamera.getViewMatrix(),
//                 this.scene.activeCamera.getProjectionMatrix()
//         );
        

//         target.x = this.scene.activeCamera.position.x - target.x;
//         target.y = this.scene.activeCamera.position.y - target.y;
//         target.z = this.scene.activeCamera.position.z - target.z;

//         const canvasPoint = this.getZeroPlaneVector(this.scene.activeCamera.position, target);

//         return new Point(canvasPoint.x, canvasPoint.z);
//    }

//     canvasToScreenPoint(canvasPoint: Point): Point {
//         const v3 = Vector3.Project(
//             new Vector3(canvasPoint.x, 1, canvasPoint.y), 
//             Matrix.Identity(), 
//             this.scene.getTransformMatrix(), 
//             this.viewport.toGlobal(this.engine.getRenderWidth(), this.engine.getRenderHeight())
//         );
//         return new Point(v3.x, v3.y);
//     }

//     getCenterPoint(): Point {
//         return this.getScreenBox().getBoundingCenter();
//     }
    
//     private setCenter(canvasPoint: Point) {
//         this.calcViewBox();
//         const center = new Point(this.engine.getRenderWidth() / 2, this.engine.getRenderHeight() / 2);
//         const canvasCenter = this.screenToCanvasPoint(center); 

//         const diff = new Vector3(canvasCenter.x, 0, canvasCenter.y).subtract(new Vector3(canvasPoint.x, 0, canvasPoint.y));
//         this.position = this.position.subtract(diff);
//     }
    
//     //usefull functions for dragging
//     private getZeroPlaneVector(pos, rot) {
//         return this.getHorizontalPlaneVector(0, pos, rot);
//     };

//     private getHorizontalPlaneVector(y, pos, rot) {
//         if (!rot.y) {
//             return null; // no solution, as it will never hit the zero plane
//         }
        
//         return new Vector3(
//             pos.x - (pos.y - y) * rot.x / rot.y,
//             1,
//             pos.z - (pos.y - y) * rot.z / rot.y
//         );
//     };

//     private calcViewBox() {
//         const screenBox = new Rectangle(new Point(0, 0), new Point(this.engine.getRenderWidth(), this.engine.getRenderHeight()));
//         this.viewBox = new Rectangle(
//             this.screenToCanvasPoint(screenBox.topLeft),
//             this.screenToCanvasPoint(screenBox.bottomRight)
//         )
//     }

//     private getRatioOfViewBox(ratio: Point): Point {
//         return this.viewBox.getSize().mul(ratio.x, ratio.y);
//     }

//     private getScreenToCanvasRatio(): number {
//         return this.getScreenBox().getWidth() /  this.viewBox.getWidth()
//     }

//     private getScreenBox(): Rectangle {
//         return new Rectangle(new Point(0, 0), new Point(this.engine.getRenderWidth(), this.engine.getRenderHeight()));
//     }
// }

// /** Get pos on plane.
//  * @param {BABYLON.Scene} scene
//  * @param {BABYLON.ArcRotateCamera} camera
//  * @param {BABYLON.Plane} plane
//  */
// function getPosition(scene, camera, plane) {
//     const ray = scene.createPickingRay(
//         scene.pointerX, scene.pointerY, Matrix.Identity(), camera, false);
//     const distance = ray.intersectsPlane(plane);

//     // not using this ray again, so modifying its vectors here is fine
//     return distance !== null ?
//         ray.origin.addInPlace(ray.direction.scaleInPlace(distance)) : null;
// }

// /** Return offsets for inertial panning given initial and current
//  * pointer positions.
//  * @param {BABYLON.Vector3} newPos
//  * @param {BABYLON.Vector3} initialPos
//  * @param {number} inertia
//  * @param {BABYLON.Vector3} ref
//  */
// function panning(newPos, initialPos, inertia, ref) {
//     const directionToZoomLocation = initialPos.subtract(newPos);
//     const panningX = directionToZoomLocation.x * (1-inertia);
//     const panningZ = directionToZoomLocation.z * (1-inertia);
//     ref.copyFromFloats(panningX, 0, panningZ);
//     return ref;
// };

// /** Get the wheel delta divided by the camera wheel precision.
//  * @param {BABYLON.PointerInfoPre} p
//  * @param {BABYLON.EventState} e
//  * @param {BABYLON.ArcRotateCamera} camera
//  */
// function zoomWheel(p, e, camera) {
//     let delta = 0;
//     if (event.deltaY) {
//         delta = -event.deltaY;
//     } else if (event.wheelDelta) {
//         delta = event.wheelDelta;
//     } else if (event.detail) {
//         delta = -event.detail;
//     }
//     delta /= camera.wheelPrecision;
//     return delta;
// }

// /** Zoom to pointer position. Zoom amount determined by delta.
//  * @param {number} delta
//  * @param {BABYLON.Scene} scene
//  * @param {BABYLON.ArcRotateCamera} camera
//  * @param {BABYLON.Plane} plane
//  * @param {BABYLON.Vector3} ref
//  */
// function zooming(delta, scene, camera, plane, ref) {
//     if (camera.radius - camera.lowerRadiusLimit < 1 && delta > 0) {
//         return;
//     } else if (camera.upperRadiusLimit - camera.radius < 1 && delta < 0) {
//         return;
//     }
//     const inertiaComp = 1 - camera.inertia;
//     if (camera.radius - (camera.inertialRadiusOffset + delta) / inertiaComp <
//           camera.lowerRadiusLimit) {
//         delta = (camera.radius - camera.lowerRadiusLimit) * inertiaComp - camera.inertialRadiusOffset;
//     } else if (camera.radius - (camera.inertialRadiusOffset + delta) / inertiaComp >
//                camera.upperRadiusLimit) {
//         delta = (camera.radius - camera.upperRadiusLimit) * inertiaComp - camera.inertialRadiusOffset;
//     }

//     const zoomDistance = delta / inertiaComp;
//     const ratio = zoomDistance / camera.radius;
//     const vec = getPosition(scene, camera, plane);

//     const directionToZoomLocation = vec.subtract(camera.target);
//     const offset = directionToZoomLocation.scale(ratio);
//     offset.scaleInPlace(inertiaComp);
//     ref.addInPlace(offset);

//     camera.inertialRadiusOffset += delta;
// }

// /** Rotate the camera
//  * @param {BABYLON.Scene} scene
//  * @param {BABYLON.Vector2} prvScreenPos
//  * @param {BABYLON.ArcRotateCamera} camera
//  */
// function rotating(scene, camera, prvScreenPos) {
//     const offsetX = scene.pointerX - prvScreenPos.x;
//     const offsetY = scene.pointerY - prvScreenPos.y;
//     prvScreenPos.copyFromFloats(scene.pointerX, scene.pointerY);
//     changeInertialAlphaBetaFromOffsets(offsetX, offsetY, camera);
// }

// /** Modifies the camera's inertial alpha and beta offsets.
//  * @param {number} offsetX
//  * @param {number} offsetY
//  * @param {BABYLON.ArcRotateCamera} camera
//  */
// function changeInertialAlphaBetaFromOffsets(offsetX, offsetY, camera) {
//     const alphaOffsetDelta = offsetX / camera.angularSensibilityX;
//     const betaOffsetDelta = offsetY / camera.angularSensibilityY;
//     camera.inertialAlphaOffset -= alphaOffsetDelta;
//     camera.inertialBetaOffset -= betaOffsetDelta;
// }

// /** Sets x y or z of passed in vector to zero if less than Epsilon.
//  * @param {BABYLON.Vector3} vec
//  */
// function zeroIfClose(vec) {
//     if (Math.abs(vec.x) < Epsilon) {
//         vec.x = 0;
//     }
//     if (Math.abs(vec.y) < Epsilon) {
//         vec.y = 0;
//     }
//     if (Math.abs(vec.z) < Epsilon) {
//         vec.z = 0;
//     }
// }
