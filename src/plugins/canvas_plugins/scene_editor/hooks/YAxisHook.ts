import { IMeshHook } from "../../../../core/engine/hooks/IMeshHook";
import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { Registry } from "../../../../core/Registry";
import { Point } from "../../../../utils/geometry/shapes/Point";

const MIN_VIEW_SIZE = 20;

export class YAxisHook implements IMeshHook {

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    setPositionHook(meshObj: MeshObj, newPos: Point): void {
        const meshView = this.registry.stores.viewStore.getByObjId(meshObj.id);

        const currPos = meshObj.getPosition();

        let newBounds = meshView.getBounds().clone();
        const savedBounds = newBounds.clone();

        const diff = (newPos.y - currPos.y) / 10;
        const scaleFactor = 1 + diff;

        newBounds.scale(new Point(scaleFactor, scaleFactor));

        if (meshView.getBounds().getWidth() < MIN_VIEW_SIZE || meshView.getBounds().getHeight() < MIN_VIEW_SIZE) {
            newBounds = savedBounds;
        }

        meshView.setBounds(newBounds);
    }
}