import { Point, Segment } from "@nightshifts.inc/geometry";
import { range } from "../../../model/utils/Functions";

export class BitmapConfig {
    canvasDimensions = new Point(1500, 1000);
    horizontalHelperLines: Segment[] = [];
    verticalHelperLines: Segment[] = [];
    pixelSize: number = 10;

    constructor() {
        this.calcHorizontalLines();
        this.calcVerticalLines();
    }


    private calcHorizontalLines() {
        const horizontalLineNum = Math.floor(this.canvasDimensions.y / this.pixelSize);
        const horizontalOffset = (this.canvasDimensions.y % this.pixelSize) / 2;
        
        this.horizontalHelperLines = range(0, horizontalLineNum)
            .map(index => {
                const y = index * this.pixelSize + horizontalOffset;
                const x1 = 0;
                const x2 = this.canvasDimensions.x;
                return new Segment(new Point(x1, y), new Point(x2, y));
            });
    }

    private calcVerticalLines() {
        const verticalLineNum = Math.floor(this.canvasDimensions.x / this.pixelSize);
        const verticalOffset = (this.canvasDimensions.x % this.pixelSize) / 2;
        
        this.verticalHelperLines = range(0, verticalLineNum)
            .map(index => {
                const x = index * this.pixelSize + verticalOffset;
                const y1 = 0;
                const y2 = this.canvasDimensions.y;
                return new Segment(new Point(x, y1), new Point(x, y2));
            });
    }
}