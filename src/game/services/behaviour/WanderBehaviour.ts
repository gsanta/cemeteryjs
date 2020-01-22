import { Point } from "../../../model/geometry/shapes/Point";
import { GameObject } from "../../../world_generator/services/GameObject";

export class WanderBehaviour {
    private static CIRCLE_RADIUS = 3;
    private static ANGLE_CHANGE = 50;

    wander(gameObject: GameObject) {
        let circleCenter = gameObject.getVelocity().clone();
        circleCenter = circleCenter.normalize();
        circleCenter = circleCenter.scale(gameObject.speed);

        let displacement = new Point(0, -1);
        displacement = displacement.scale(WanderBehaviour.CIRCLE_RADIUS);

        this.setAngle(displacement, gameObject.wanderAngle);
        gameObject.wanderAngle += Math.random() * WanderBehaviour.ANGLE_CHANGE - WanderBehaviour.ANGLE_CHANGE * .5;

        const wanderForce = circleCenter.add(displacement);
        return wanderForce;
    }

    private setAngle(vector: Point, value: number) {
        vector.x = Math.cos(value) * vector.len();
        vector.y = Math.sin(value) * vector.len();
    }
}