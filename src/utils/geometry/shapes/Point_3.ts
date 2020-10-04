import { Point } from "./Point";


export class Point_3 extends Point {
    z: number;

    constructor(x: number, y: number, z: number) {
        super(x, y);
        this.z = z;
    }
}