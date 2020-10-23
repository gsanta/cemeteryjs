import { IMeshHook } from "../../../../core/engine/hooks/IMeshHook";
import { ISpriteHook } from "../../../../core/engine/hooks/ISpriteHook";
import { MeshObj } from "../../../../core/models/objs/MeshObj";
import { SpriteObj } from "../../../../core/models/objs/SpriteObj";
import { Registry } from "../../../../core/Registry";
import { Point } from "../../../../utils/geometry/shapes/Point";

const MIN_VIEW_SIZE = 20;

export class YAxisHook implements IMeshHook {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    setPositionHook(meshObj: MeshObj, newPos: Point): void {
        setPosition(this.registry, meshObj, newPos);
    }

    hookCreateInstance(meshObj: MeshObj): void {
        const realDimensions = this.registry.engine.meshes.getDimensions(meshObj);
        const meshView = this.registry.stores.views.getByObjId(meshObj.id);
        meshView.getBounds().setWidth(realDimensions.x);
        meshView.getBounds().setHeight(realDimensions.y);
    }
}

export class SpriteYAxisHook implements ISpriteHook {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
    setPositionHook(spriteObj: SpriteObj, newPos: Point): void {
        setPosition(this.registry, spriteObj, newPos);
    }
}

function setPosition(registry: Registry, meshObj: SpriteObj | MeshObj, newPos: Point) {
    const meshView = registry.stores.views.getByObjId(meshObj.id);

    if (!meshView) { return; }

    const currPos = meshObj.getPosition();

    if (currPos.y === newPos.y) { return; }

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