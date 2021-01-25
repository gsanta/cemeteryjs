import { MeshObj } from "../../../../../core/models/objs/MeshObj";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { MoveDirection } from "../../models/nodes/MoveNode";

export class MeshMover {
    private time = undefined;
    private meshObj: MeshObj;
    private speed: number;
    private directions: MoveDirection[] = [];
    private isStopped = true;
    private onMoveCallbacks: (() => boolean)[] = [];

    tick() {
        if (this.isStopped || this.meshObj === undefined || this.speed === undefined) {
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

    setDirections(directions: MoveDirection[]) {
        this.directions = directions;
    }

    private move(deltaTime: number): void {
        const speed = deltaTime * 0.01 * this.speed;

        this.directions.forEach(direction => {
            switch(direction) {
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
        });
    }
}

