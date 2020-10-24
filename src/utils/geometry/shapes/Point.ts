
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
        this.x += point.x;
        this.y += point.y;

        return this;
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

    divX(amount: number): Point {
        return new Point(this.x / amount, this.y);
    }

    divY(amount: number): Point {
        return new Point(this.x, this.y / amount);
    }

    subtract(otherPoint: Point): Point {
        return new Point(this.x - otherPoint.x, this.y - otherPoint.y);
    }

    len(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    getVectorCenter(): Point {
        return new Point(this.x / 2, this.y / 2);
    }

    clone(): Point {
        return new Point(this.x, this.y);
    }

    equalTo(otherPoint: Point): boolean {
        if (!otherPoint) { return false; }
        return this.x === otherPoint.x && this.y === otherPoint.y;
    }

    angleToOrigin() {
        return -Math.atan2(this.y, this.x);
    }

    distanceTo(otherPoint: Point) {
        return Math.sqrt(Math.pow(this.x - otherPoint.x, 2) + Math.pow(this.y - otherPoint.y, 2));
    }

    normalize() {
        const len = this.len();
        this.x /= len;
        this.y /= len;
    }

    toString(): string {
        return `(${this.x}:${this.y})`;
    }

    static fromString(str: string): Point {
        const matcher = /\(([-\d\.]+):([-\d\.]+)\)/;
        const match = str.match(matcher);
        return new Point(parseFloat(match[1]), parseFloat(match[2]));
    }
}