import { GeometryService } from '../GeometryService';

export class Point {
    public x: number;
    public y: number;

    private geometryService: GeometryService;

    constructor(x: number, y: number, geometryService: GeometryService = new GeometryService()) {
        this.x = x;
        this.y = y;
        this.geometryService = geometryService;
    }

    addX(amount: number): Point {
        return this.geometryService.factory.point(this.x + amount, this.y);
    }

    addY(amount: number): Point {
        return this.geometryService.factory.point(this.x, this.y + amount);
    }

    scaleX(times: number): Point {
        return this.geometryService.factory.point(this.x * times, this.y);
    }

    scaleY(times: number): Point {
        return this.geometryService.factory.point(this.x, this.y * times);
    }

    negate(): Point {
        return this.geometryService.factory.point(-this.x, - this.y);
    }

    negateX(): Point {
        return this.geometryService.factory.point(-this.x, this.y);
    }

    negateY(): Point {
        return this.geometryService.factory.point(this.x, -this.y);
    }

    mul(x: number, y?: number): Point {
        y = y === undefined ? x : y;
        return this.geometryService.factory.point(this.x * x, this.y * y);
    }

    perpendicularVector(): Point {
        return this.geometryService.factory.point(this.y, -this.x);
    }

    /*
     * Returns true if the line through this and the parameter is not
     * vertical and not horizontal
     */
    isDiagonalTo(otherPoint: Point): boolean {
        return this.x !== otherPoint.x && this.y !== otherPoint.y;
    }

    absoluteDistanceTo(otherPoint: Point): [number, number] {
        return [
            Math.abs(this.x - otherPoint.x),
            Math.abs(this.y - otherPoint.y)
        ];
    }

    distanceTo(otherPoint: Point): number {
        return this.subtract(otherPoint).distanceToOrigin();
    }

    distanceToOrigin(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    subtract(otherPoint: Point): Point {
        return this.geometryService.factory.point(this.x - otherPoint.x, this.y - otherPoint.y);
    }

    normalize() {
        const length = this.distanceToOrigin();

        return this.geometryService.factory.point(this.x / length, this.y / length);
    }

    isNormalized() {
        return this.distanceToOrigin() === 1;
    }

    angleTo(otherPoint: Point) {
        const norm1 = this.normalize();
        const norm2 = otherPoint.normalize();
        return Math.atan2(norm1.y, norm1.x) - Math.atan2(norm2.y, norm2.x);
    }

    clone(): Point {
        return this.geometryService.factory.point(this.x, this.y);
    }

    equalTo(otherPoint: Point) {
        return this.x === otherPoint.x && this.y === otherPoint.y;
    }

    toString(): string {
        return `(${this.x},${this.y})`;
    }
}