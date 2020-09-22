import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { Point } from "../../../../../utils/geometry/shapes/Point";

const speedConstant = 250;

export class RouteWalker {
    private meshObj: MeshObj;
    private pathObj: PathObj;
    private prevTime: number;
    private currentPointIndex: number = -1;
    private distance: number;
    private progress: number = 0;
    private points: Point[];

    private speed = 1;
    private vector: Point;

    constructor(meshObj: MeshObj, pathObj: PathObj) {
        this.meshObj = meshObj;
        this.pathObj = pathObj;
        this.points = this.pathObj.getPoints();
    }

    step() {
        const delta = this.computeDelta() * this.speed / speedConstant;
        this.progress += delta;
        
        this.updateControlPoint();
        console.log('delta: ' + this.progress + ' len: ' + this.vector.len());
        this.meshObj.setPosition(this.calcPosition());
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    private updateControlPoint() {
        if (this.currentPointIndex === -1 || this.progress > this.distance) {
            this.progress = 0;

            if (this.currentPointIndex === this.points.length - 2) {
                this.currentPointIndex = 0;
            } else {
                this.currentPointIndex += 1;
            }

            this.vector = this.points[this.currentPointIndex + 1].subtract(this.points[this.currentPointIndex]);

            this.distance = this.vector.len();
        }
    }

    private calcPosition(): Point {
        const currentPoint = this.points[this.currentPointIndex];

        return currentPoint.clone().add(this.vector.clone().mul(this.progress / this.distance));
    }

    private computeDelta(): number {
        const currentTime = Date.now();
        this.prevTime = this.prevTime === undefined ? currentTime : this.prevTime;

        const delta = currentTime - this.prevTime;

        this.prevTime = currentTime;

        return delta;
    }

}