import { ArcRotateCamera, Axis, Epsilon, Matrix, Plane, Vector3 } from 'babylonjs';
import { Point } from '../../../../utils/geometry/shapes/Point';
import { Rectangle } from '../../../../utils/geometry/shapes/Rectangle';
import { Bab_EngineFacade } from '../../../engine/adapters/babylonjs/Bab_EngineFacade';
import { PointerTracker } from '../../../controller/ToolHandler';
import { Registry } from '../../../Registry';
import { ICamera } from './ICamera';
import { AbstractCanvasPanel } from '../../../plugin/AbstractCanvasPanel';

export class Camera3D implements ICamera {
    private startY: number;
    camera: ArcRotateCamera;
    private plane = Plane.FromPositionAndNormal(Vector3.Zero(), Axis.Y);
    private inertialPanning = Vector3.Zero();
    private engine: Bab_EngineFacade;
    private zoomFactor: number = 5;

    setEngine(engine: Bab_EngineFacade) {
        this.engine = engine;

        this.camera = new ArcRotateCamera("Camera", -Math.PI / 2, 0, 150, Vector3.Zero(), this.engine.scene);
        this.camera.attachControl(false);

        this.startY = this.camera.position.y;
        this.camera.inertia = 0.7;
        this.camera.lowerRadiusLimit = 10;
        this.camera.upperRadiusLimit = 1000;
        this.camera.upperBetaLimit = Math.PI / 2 - 0.1;
        this.camera.angularSensibilityX = this.camera.angularSensibilityY = 500;

        this.engine.scene.onBeforeRenderObservable.add(
            () => {
                if (this.inertialPanning.x !== 0 || this.inertialPanning.y !== 0 || this.inertialPanning.z !== 0) {
                    this.camera.target.addInPlace(this.inertialPanning);
                    this.inertialPanning.scaleInPlace(this.camera.inertia);
                    zeroIfClose(this.inertialPanning);
                }
            }
        );
    }

    resize() {
        this.engine && this.engine.engine && this.engine.engine.resize();
    }

    pan(pointer: PointerTracker) {
        const directionToZoomLocation = pointer.down.subtract(pointer.curr);
        const panningX = directionToZoomLocation.x * (1-this.camera.inertia);
        const panningY = directionToZoomLocation.y * (1-this.camera.inertia);
        this.inertialPanning.copyFromFloats(panningX, 0, panningY);
    }

    zoomWheel(pointer: PointerTracker) {
        const zoomRatio = -pointer.wheelDiff / this.camera.wheelPrecision / this.zoomFactor;
        this.zoom(zoomRatio, pointer);
    }

    zoomIn(pointer: PointerTracker) {
        this.zoom(2, pointer);
        return true;
    }

    zoomOut(pointer: PointerTracker) {
        this.zoom(-2, pointer);
        return true;
    }

    zoom(delta: number, pointer: PointerTracker) {
        if (this.camera.radius - this.camera.lowerRadiusLimit < 1 && delta > 0) {
            return;
        } else if (this.camera.upperRadiusLimit - this.camera.radius < 1 && delta < 0) {
            return;
        }
        const inertiaComp = 1 - this.camera.inertia;
        if (this.camera.radius - (this.camera.inertialRadiusOffset + delta) / inertiaComp < this.camera.lowerRadiusLimit) {
            delta = (this.camera.radius - this.camera.lowerRadiusLimit) * inertiaComp - this.camera.inertialRadiusOffset;
        } else if (this.camera.radius - (this.camera.inertialRadiusOffset + delta) / inertiaComp > this.camera.upperRadiusLimit) {
            delta = (this.camera.radius - this.camera.upperRadiusLimit) * inertiaComp - this.camera.inertialRadiusOffset;
        }
    
        const zoomDistance = delta / inertiaComp;
        const ratio = zoomDistance / this.camera.radius;

        const vec = new Vector3(pointer.curr.x, 0, pointer.curr.y);
    
        const directionToZoomLocation = vec.subtract(this.camera.target);
        const offset = directionToZoomLocation.scale(ratio);
        offset.scaleInPlace(inertiaComp);
        this.inertialPanning.addInPlace(offset);
    
        this.camera.inertialRadiusOffset += delta;
    }

    getScale(): number {
        return this.startY / this.camera.position.y;
    }

    getTranslate(): Point {
        return null;
    }

    screenToCanvasPoint(screenPoint: Point): Point {
        if (!this.engine || !this.engine.scene) {
            return new Point(0, 0);
        }

        const ray = this.engine.scene.createPickingRay(screenPoint.x, screenPoint.y, Matrix.Identity(), this.camera, false);
        const distance = ray.intersectsPlane(this.plane);
    
        const vector3 = distance !== null ? ray.origin.addInPlace(ray.direction.scaleInPlace(distance)) : null;
        return vector3 ? new Point(vector3.x, vector3.z) : null;
   }

    getCenterPoint(): Point {
        return this.getScreenBox().getBoundingCenter();
    }

    private getScreenBox(): Rectangle {
        return new Rectangle(new Point(0, 0), new Point(this.engine.engine.getRenderWidth(), this.engine.engine.getRenderHeight()));
    }

    rotate(pointer: PointerTracker) {
        const offsetX = pointer.currScreen.x - pointer.prevScreen.x;
        const offsetY = pointer.currScreen.y - pointer.prevScreen.y;
        this.changeInertialAlphaBetaFromOffsets(offsetX, offsetY, this.camera);
    }

    private changeInertialAlphaBetaFromOffsets(offsetX, offsetY, camera) {
        const alphaOffsetDelta = offsetX / camera.angularSensibilityX;
        const betaOffsetDelta = offsetY / camera.angularSensibilityY;
        camera.inertialAlphaOffset -= alphaOffsetDelta;
        camera.inertialBetaOffset -= betaOffsetDelta;
    }
}

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