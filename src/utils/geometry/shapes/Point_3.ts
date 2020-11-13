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

    div(amount: number): Point_3 {
        return new Point_3(this.x / amount, this.y / amount, this.z / amount);
    }
    
    negateY(): Point_3 {
        return new Point_3(this.x, -this.y, this.z);
    }

    negateZ(): Point_3 {
        return new Point_3(this.x, this.y, -this.z);
    }
}