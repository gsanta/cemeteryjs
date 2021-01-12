import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { Point_3 } from "../../../../utils/geometry/shapes/Point_3";
import { MoveDirection } from "../models/nodes/MoveNode";

export class MeshMover {
    private time = undefined;
    private meshObj: MeshObj;
    private speed: number;
    private direction: MoveDirection;
    private isStopped = true;
    private onMoveCallbacks: (() => boolean)[] = [];
    private id: string;

    constructor(id: string) {
        this.id = id;
    }

    tick() {
        if (this.isStopped || this.meshObj === undefined || this.direction === undefined || this.speed === undefined) {
            return;
        }

        const currentTime = Date.now();
        if (this.time !== undefined) {
            const currentPos = this.meshObj.getPosition();
            this.move(currentTime - this.time);

            const isValid = this.onMoveCallbacks.find(callback => callback());
            if (!isValid) {
                this.meshObj.setPosition(currentPos);
            }
            // this.meshObj.translate(nextPos);
        }
        this.time = currentTime;
    }

    onMove(callback: () => boolean) {
        this.onMoveCallbacks.push(callback);
    }

    offMove(callback: () => boolean) {
        this.onMoveCallbacks = this.onMoveCallbacks.filter(cb => cb !== callback);
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

    private move(deltaTime: number): void {
        const speed = deltaTime * 0.01 * this.speed;

        const currentPos = this.meshObj.getPosition().clone();

        switch(this.direction) {
            case MoveDirection.Forward:
                // currentPos.add(new Point_3(0, 0, speed));
                this.meshObj.translate(new Point_3(0, 0, speed));
                break;
            case MoveDirection.Backward:
                // currentPos.add(new Point_3(0, 0, -speed));
                this.meshObj.translate(new Point_3(0, 0, -speed));
                break;
            case MoveDirection.Left:
                // currentPos.add(new Point_3(-speed, 0, 0));
                this.meshObj.translate(new Point_3(-speed, 0, 0));
                break;
            case MoveDirection.Right:
                // currentPos.add(new Point_3(speed, 0, 0));
                this.meshObj.translate(new Point_3(speed, 0, 0));
                break;    
        }

        // return currentPos;
    }
}

