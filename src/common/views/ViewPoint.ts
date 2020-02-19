import { Point } from "../../misc/geometry/shapes/Point";

export class ViewPoint extends Point {
    isHovered: boolean;
    isSelected: boolean;

    constructor(x: number, y: number, isHovered = false, isSelected = false) {
        super(x, y);
        this.isHovered = isHovered;
        this.isSelected = isSelected;
    }
}