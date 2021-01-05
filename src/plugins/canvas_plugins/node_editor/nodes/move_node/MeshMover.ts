import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { MoveDirection } from "./MoveNode";

export class MeshMover {
    private time = undefined;
    private meshObj: MeshObj;
    private speed: number;
    private direction: MoveDirection;
    private isStopped = true;

    tick() {
        if (this.isStopped || this.meshObj === undefined || this.direction === undefined || this.speed === undefined) {
            return;
        }

        const currentTime = Date.now();
        if (this.time !== undefined) {
            this.move(currentTime - this.time);
        }
        this.time = currentTime;
    }

    stop() {
        this.isStopped = true;
        this.reset();
    }

    start() {
        this.isStopped = false;
    }

    reset() {
        this.time = undefined;
    }

    setMeshObj(meshObj: MeshObj) {
        this.meshObj = meshObj;
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    setDirection(direction: MoveDirection) {
        this.direction = direction;
    }

    private move(deltaTime: number) {
        const speed = deltaTime * 0.01 * this.speed;

        switch(this.direction) {
            case MoveDirection.Forward:
                this.meshObj.translate(new Point_3(0, 0, speed));
                break;
            case MoveDirection.Backward:
                this.meshObj.translate(new Point_3(0, 0, -speed));
                break;
            case MoveDirection.Left:
                this.meshObj.translate(new Point_3(-speed, 0, 0));
                break;
            case MoveDirection.Right:
                this.meshObj.translate(new Point_3(speed, 0, 0));
                break;    
        }
    }
}

