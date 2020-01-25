import { Point } from "../../../model/geometry/shapes/Point";
import { GameObject } from "../../../world_generator/services/GameObject";
import { IBehaviour, BehaviourType } from "./IBehaviour";

export class WanderBehaviour implements IBehaviour {
    type = BehaviourType.Ramble;
    private static CIRCLE_RADIUS = 3;
    private static ANGLE_CHANGE = 50;

    update(gameObject: GameObject): void {
        const wanderForce = this.getWanderForce(gameObject);
        gameObject.moveBy(wanderForce.div(30));
        // gameObject.setDirection(gameObject.getDirection().add(wanderForce));
    }

    canActivate() {
        return true;
    }

    private getWanderForce(gameObject: GameObject): Point {
        let circleCenter = gameObject.getDirection().clone();
        circleCenter = circleCenter.normalize();
        // circleCenter = circleCenter.scale(gameObject.speed);

        let displacement = new Point(0, -1);
        displacement = displacement.scale(WanderBehaviour.CIRCLE_RADIUS);

        this.setAngle(displacement, gameObject.wanderAngle);
        gameObject.wanderAngle += Math.random() * WanderBehaviour.ANGLE_CHANGE - WanderBehaviour.ANGLE_CHANGE * .5;

        const wanderForce = circleCenter.add(displacement);
        return wanderForce.normalize();
    }

    private setAngle(vector: Point, value: number) {
        vector.x = Math.cos(value) * vector.len();
        vector.y = Math.sin(value) * vector.len();
    }
}