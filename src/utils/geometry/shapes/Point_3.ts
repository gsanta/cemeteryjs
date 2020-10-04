import { Point } from "./Point";

export class Point_3 extends Point {
    z: number;

    constructor(x: number, y: number, z: number) {
        super(x, y);
        this.z = z;
    }


    add(point: Point_3): Point_3 {
        this.x += point.x;
        this.y += point.y;
        this.z += point.z;

        return this;
    }
}