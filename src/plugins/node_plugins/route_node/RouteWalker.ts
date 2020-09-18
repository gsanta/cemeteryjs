import { MeshObj } from "../../../core/models/game_objects/MeshObj";
import { PathObj } from "../../../core/models/game_objects/PathObj";
import { Point } from "../../../utils/geometry/shapes/Point";

const defaultSpeed = 1000 / 4;

export class RouteWalker {
    private meshObj: MeshObj;
    private pathObj: PathObj;
    private prevTime: number;
    private isFinished = false;
    private currentPointIndex: number = -1;
    private distance: number;
    private relativeDistance: number;
    private progress: number = 0;
    private points: Point[];
    private vector: Point;

    constructor(meshObj: MeshObj, pathObj: PathObj) {
        this.meshObj = meshObj;
        this.pathObj = pathObj;
        this.points = this.pathObj.getPoints();
    }

    step() {
        const delta = this.computeDelta() / defaultSpeed;
        this.progress += delta;
        
        this.updateControlPoint();
        console.log('delta: ' + this.progress + ' len: ' + this.vector.len());
        this.meshObj.setPosition(this.calcPosition());
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