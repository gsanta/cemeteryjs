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

    addX(x: number): Point_3 {
        this.x += x;
        return this;
    }

    addY(y: number): Point {
        this.y += y;
        return this;
    }

    addZ(z: number): Point_3 {
        this.z += z;
        return this;
    }

    subtract(point: Point_3): Point_3 {
        this.x -= point.x;
        this.y -= point.y;
        this.z -= point.z;

        return this;
    }

    div(amount: number): Point_3 {
        return new Point_3(this.x / amount, this.y / amount, this.z / amount);
    }

    negate(): Point_3 {
        return new Point_3(-this.x, - this.y, -this.z);
    }
    
    negateY(): Point_3 {
        return new Point_3(this.x, -this.y, this.z);
    }

    negateZ(): Point_3 {
        return new Point_3(this.x, this.y, -this.z);
    }

    distanceTo(otherPoint: Point_3) {
        return Math.sqrt(Math.pow(this.x - otherPoint.x, 2) + Math.pow(this.y - otherPoint.y, 2) + Math.pow(this.z - otherPoint.z, 2));
    }

    clone(): Point_3 {
        return new Point_3(this.x, this.y, this.z);
    }

    toString(): string {
        return `${this.x}:${this.y}:${this.z}`;
    }
}