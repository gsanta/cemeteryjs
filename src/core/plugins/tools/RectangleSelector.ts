import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from '../../../utils/geometry/shapes/Rectangle';
import { RectSelectFeedback } from "../../stores/views/RectSelectFeedback";
import { Registry } from "../../Registry";
import { MousePointer } from "../../services/input/MouseService";
import { Tool } from './Tool';

export class RectangleSelector {


    createRect(pointer: MousePointer): Rectangle {
        const minX = pointer.down.x < pointer.curr.x ? pointer.down.x : pointer.curr.x;
        const minY = pointer.down.y < pointer.curr.y ? pointer.down.y : pointer.curr.y;
        const maxX = pointer.down.x >= pointer.curr.x ? pointer.down.x : pointer.curr.x;
        const maxY = pointer.down.y >= pointer.curr.y ? pointer.down.y : pointer.curr.y;
        const rect = new Rectangle(new Point(minX, minY), new Point(maxX, maxY));

        return rect;
    }
}