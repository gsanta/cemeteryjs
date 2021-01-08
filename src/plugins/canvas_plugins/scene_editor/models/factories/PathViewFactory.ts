import { PathObj, PathObjType } from "../../../../../core/models/objs/PathObj";
import { PathPointView } from "../../../../../core/models/views/child_views/PathPointView";
import { ViewFactoryAdapter } from "../../../../../core/models/views/View";
import { Canvas2dPanel } from "../../../../../core/plugin/Canvas2dPanel";
import { Registry } from "../../../../../core/Registry";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { PathView } from "../views/PathView";

export class PathViewFactory extends ViewFactoryAdapter {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    instantiate() {
        return new PathView();
    }

    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle) {
        const pointer = this.registry.services.pointer.pointer;

        const pathObj = <PathObj> this.registry.services.objService.createObj(PathObjType);
        const pathView: PathView = <PathView> this.instantiate();
        pathView.setObj(pathObj);

        const editPoint = new PathPointView(pathView, pointer.down.clone());
        pathView.addPathPoint(editPoint);
        panel.getViewStore().addView(pathView);
        this.registry.stores.objStore.addObj(pathObj);
        panel.getViewStore().addSelectedView(pathView);

        return pathView;
    }
}