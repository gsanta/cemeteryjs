import { ArcRotateCamera, Axis, Epsilon, Matrix, Plane, Vector3 } from 'babylonjs';
import { Point } from '../../../misc/geometry/shapes/Point';
import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { MousePointer } from '../../../core/services/input/MouseService';
import { ServiceLocator } from '../../../core/services/ServiceLocator';
import { ICamera } from './ICamera';
import { Registry } from '../../Registry';

export class RendererCamera implements ICamera {
    private startY: number;
    camera: ArcRotateCamera;
    private plane = Plane.FromPositionAndNormal(Vector3.Zero(), Axis.Y);
    private inertialPanning = Vector3.Zero();
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        const scene = this.registry.services.game.getScene();
        this.camera = new ArcRotateCamera("Camera", -Math.PI / 2, 0, 150, Vector3.Zero(), scene);

        this.startY = this.camera.position.y;
        this.camera.inertia = 0.7;
        this.camera.lowerRadiusLimit = 10;
        this.camera.upperRadiusLimit = 1000;
        this.camera.upperBetaLimit = Math.PI / 2 - 0.1;
        this.camera.angularSensibilityX = this.camera.angularSensibilityY = 500;

        scene.onBeforeRenderObservable.add(
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
        
    }

    pan(pointer: MousePointer) {
        const directionToZoomLocation = pointer.down.subtract(pointer.curr);
        const panningX = directionToZoomLocation.x * (1-this.camera.inertia);
        const panningY = directionToZoomLocation.y * (1-this.camera.inertia);
        this.inertialPanning.copyFromFloats(panningX, 0, panningY);
    }

    zoomWheel() {
        const zoomRatio = -this.registry.services.pointer.wheelDiff / this.camera.wheelPrecision;
        this.zoom(zoomRatio);
    }

    zoomIn() {
        this.zoom(2);
    }

    zoomOut() {
        this.zoom(-2);
    }

    zoom(delta: number) {
        const pointer = this.registry.services.pointer.pointer;
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
        const scene = this.registry.services.game.getScene();

        const ray = scene.createPickingRay(screenPoint.x, screenPoint.y, Matrix.Identity(), this.camera, false);
        const distance = ray.intersectsPlane(this.plane);
    
        const vector3 = distance !== null ? ray.origin.addInPlace(ray.direction.scaleInPlace(distance)) : null;
        return vector3 ? new Point(vector3.x, vector3.z) : null;
   }

    getCenterPoint(): Point {
        return this.getScreenBox().getBoundingCenter();
    }

    private getScreenBox(): Rectangle {
        const engine = this.registry.services.game.getEngine();
        return new Rectangle(new Point(0, 0), new Point(engine.getRenderWidth(), engine.getRenderHeight()));
    }

    rotate(pointer: MousePointer) {
        const scene = this.registry.services.game.getScene();

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