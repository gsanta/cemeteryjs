import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { PathObj } from "../../../../../core/models/objs/PathObj";
import { LineSegment } from "../../../../../utils/geometry/shapes/LineSegment";
import { Point } from "../../../../../utils/geometry/shapes/Point";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { BezierCurve } from "./BezierCurve";
import { BezierCurvePath } from "./BezierCurvePath";

const speedConstant = 250;

export class RouteWalker {
    private readonly meshObj: MeshObj;
    private readonly pathObj: PathObj;
    private speed = 1;

    private points: Point[];
    private currentDestinationPointIndex: number = -1;
    private currentPosition: Point;
    private currentDirection: Point;
    
    private prevTime: number;
    private prevDistanceCurrentDestinationtPoint: number = Number.MAX_VALUE;

    constructor(meshObj: MeshObj, pathObj: PathObj) {
        this.meshObj = meshObj;
        this.pathObj = pathObj;
        this.points = new BezierCurvePath(this.pathObj).getPoints();
    }

    step() {
        const deltaTime = this.prevTime === undefined ? 0 : Date.now() - this.prevTime;
        this.prevTime = Date.now();
    
    if (this.currentDestinationPointIndex === -1) {
            this.initRoute();
        } else {
            this.updateRoute(deltaTime);

            const rot = this.meshObj.getRotation();
            this.meshObj.setRotation(new Point_3(rot.x, this.currentDirection.angleToOrigin(), rot.z));
            this.meshObj.setPosition(new Point_3(this.currentPosition.x, this.meshObj.getPosition().y, this.currentPosition.y));
        }
    }

    start() {
        this.prevTime = undefined;
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    private initRoute() {
        this.currentDestinationPointIndex = 1;
        this.prevDistanceCurrentDestinationtPoint = Number.MAX_VALUE;
        this.currentPosition = this.points[0];
        this.setRotation();
    }

    private updateRoute(deltaTime: number) {
        const distanceToNextPoint = this.getDistanceToNextPoint()
        // TODO: remove distanceToNextPoint < 3 and solve in a safer way
        if (this.prevDistanceCurrentDestinationtPoint <= distanceToNextPoint && distanceToNextPoint < 3) {
            this.setNewDestination();
            this.prevDistanceCurrentDestinationtPoint = Number.MAX_VALUE;
        } else {
            this.prevDistanceCurrentDestinationtPoint = distanceToNextPoint;
        }

        this.setRotation();
        this.setPosition(deltaTime);
    }

    private setNewDestination() {
        if (this.currentDestinationPointIndex === this.points.length - 1) {
            this.currentDestinationPointIndex = 1;
            this.currentPosition = this.points[0];
        } else {
            this.currentDestinationPointIndex += 1;
        }
    }

    private getDistanceToNextPoint() {
        return this.points[this.currentDestinationPointIndex].distanceTo(this.currentPosition);
    }

    private setRotation() {
        this.currentDirection = this.points[this.currentDestinationPointIndex].subtract(this.points[this.currentDestinationPointIndex - 1]);
        this.currentDirection.normalize();
    }

    private setPosition(deltaTime: number) {
        const deltaSpeed = deltaTime * this.speed / speedConstant;
        const delta = this.currentDirection.clone().mul(deltaSpeed);
        const currentPoint = this.currentPosition.clone();
        currentPoint.add(delta);
        this.currentPosition = currentPoint;
    }
}