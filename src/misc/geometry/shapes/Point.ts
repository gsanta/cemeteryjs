
export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    setX(x: number): Point {
        return new Point(x, this.y);
    }

    setY(y: number): Point {
        return new Point(this.x, y);
    }

    add(point: Point): Point {
        return this.addX(point.x).addY(point.y);
    }

    addX(amount: number): Point {
        return new Point(this.x + amount, this.y);
    }

    addY(amount: number): Point {
        return new Point(this.x, this.y + amount);
    }

    scaleX(times: number): Point {
        return new Point(this.x * times, this.y);
    }

    scaleY(times: number): Point {
        return new Point(this.x, this.y * times);
    }

    scale(times: number): Point {
        return new Point(this.x * times, this.y * times);
    }

    negate(): Point {
        return new Point(-this.x, - this.y);
    }

    negateX(): Point {
        return new Point(-this.x, this.y);
    }

    negateY(): Point {
        return new Point(this.x, -this.y);
    }

    mul(x: number, y?: number): Point {
        y = y === undefined ? x : y;
        return new Point(this.x * x, this.y * y);
    }

    div(amount: number): Point {
        return new Point(this.x / amount, this.y / amount);
    }

    perpendicularVector(): Point {
        return new Point(this.y, -this.x);
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
        return new Point(this.x - otherPoint.x, this.y - otherPoint.y);
    }

    normalize() {
        const length = this.distanceToOrigin();

        return new Point(this.x / length, this.y / length);
    }

    isNormalized() {
        return this.distanceToOrigin() === 1;
    }

    angleTo(otherPoint: Point) {
        const norm1 = this.normalize();
        const norm2 = otherPoint.normalize();
        return Math.atan2(norm1.y, norm1.x) - Math.atan2(norm2.y, norm2.x);
    }

    len(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    limit(max: number) {
        if (this.len() > max) {
            const p = this.mul(max / this.len());
            this.x = p.x;
            this.y = p.y;
        }
    }

    getVectorCenter(): Point {
        return new Point(this.x / 2, this.y / 2);
    }

    clone(): Point {
        return new Point(this.x, this.y);
    }

    equalTo(otherPoint: Point) {
        return this.x === otherPoint.x && this.y === otherPoint.y;
    }

    toString(): string {
        return `(${this.x},${this.y})`;
    }
}