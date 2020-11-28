import { Point_3 } from "../../../utils/geometry/shapes/Point_3";


export enum CanvasAxis {
    X = 'X',
    Y = 'Y',
    Z = 'Z'
}

export namespace CanvasAxis {
    export function getAxisVal(point3: Point_3, axis: CanvasAxis) {
        switch(axis) {
            case CanvasAxis.X:
                return point3.x;
            case CanvasAxis.Y:
                return point3.y;
            case CanvasAxis.Z:
                return point3.z;
        }
    }

    export function setAxisVal(point3: Point_3, axis: CanvasAxis, newVal: number) {
        switch(axis) {
            case CanvasAxis.X:
                point3.x = newVal;
                break;
            case CanvasAxis.Y:
                point3.y = newVal;
                break;
            case CanvasAxis.Z:
                point3.z = newVal;
                break;
        }
    }
}