import { PathObj, PathObjType } from "../../../../../core/models/objs/PathObj";
import { PathPoinShape } from "../../../../../core/models/shapes/child_views/PathPointShape";
import { ShapeFactoryAdapter } from "../../../../../core/models/shapes/AbstractShape";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
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
        const pointer = this.registry.services.pointer.pointer;

        const pathObj = <PathObj> this.registry.services.objService.createObj(PathObjType);
        const pathView: PathShape = <PathShape> this.instantiate();
        pathView.setObj(pathObj);

        const editPoint = new PathPoinShape(pathView, pointer.down.clone());
        pathView.addPathPoint(editPoint);
        panel.getViewStore().addShape(pathView);
        this.registry.stores.objStore.addObj(pathObj);
        panel.getViewStore().addSelectedShape(pathView);

        return pathView;
    }
}