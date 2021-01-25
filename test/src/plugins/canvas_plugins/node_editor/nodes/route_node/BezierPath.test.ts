import { PathObj } from "../../../../../../../src/core/models/objs/PathObj";
import { Point } from "../../../../../../../src/utils/geometry/shapes/Point";
import { BezierCurvePath } from "../../../../../../../src/modules/graph_editor/main/models/BezierCurvePath";



test('BezierPath converts the points of a regular PathObj by inserting additional points around the original points.', () => {

    const pathObj = new PathObj();
    pathObj.points = [new Point(10, 10), new Point(30, 10), new Point(30, -10)];

    const bezierPath = new BezierCurvePath(pathObj);

    console.log(bezierPath.getPoints().map(p => p.toString()).join(', '))
});