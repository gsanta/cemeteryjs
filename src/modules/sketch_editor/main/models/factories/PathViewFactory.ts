import { PathObj, PathObjType } from "../../../../../core/models/objs/PathObj";
import { PathPoinShape } from "../../../../../core/models/shapes/child_views/PathPointShape";
import { AbstractShape, ShapeFactoryAdapter } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/models/modules/Canvas2dPanel";
import { Registry } from "../../../../../core/Registry";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { PathShape } from "../shapes/PathShape";

export class PathViewFactory extends ShapeFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    instantiate() {
        return new PathShape();
    }

    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle) {
        const pointer = panel.pointer.pointer;

        const pathObj = <PathObj> this.registry.services.objService.createObj(PathObjType);
        const pathView: PathShape = <PathShape> this.instantiate();
        pathView.setObj(pathObj);

        const editPoint = new PathPoinShape(pathView, pointer.down.clone());
        pathView.addPathPoint(editPoint);
        panel.data.items.addItem(pathView);
        this.registry.data.scene.items.addItem(pathObj);
        panel.data.selection.addItem(pathView);

        return pathView;
    }
}