import { ShapeObservable } from "../../../../../core/models/ShapeObservable";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { ScaleAxisView, ScaleAxisShapeType } from "../../models/shapes/edit/ScaleAxisShape";
import { AbstractAxisTool } from "./AbstractAxisTool";

export const ScaleAxisToolId = 'scale-axis-tool';

export class ScaleAxisTool extends AbstractAxisTool<ScaleAxisView> {
    private initialScale: Point_3;
    private initialBounds: Rectangle;

    constructor(panel: AbstractCanvasPanel, registry: Registry, shapeObservable: ShapeObservable) {
        super(ScaleAxisToolId, panel, registry, shapeObservable, ScaleAxisShapeType);
    }

    down() {
        super.down();
        if (this.meshView) {
            this.initialScale = this.meshView.getObj().getScale();
            this.initialBounds = this.meshView.getBounds().clone();
        }
    }

    up() {
        super.up();
        this.initialScale = undefined;
        this.initialBounds = undefined;
    }

    protected updateX() {
        const scale = this.meshView.getObj().getScale();
        scale.x = this.initialScale.x * this.getDiffRatio().x;

        const realDimensions = this.registry.engine.meshes.getDimensions(this.meshView.getObj())
        
        this.meshView.getObj().setScale(scale);
        this.meshView.getBounds().setWidth(realDimensions.x);
    }

    protected updateZ() {
        const scale = this.meshView.getObj().getScale();

        scale.z = this.initialScale.z * this.getDiffRatio().y;

        const realDimensions = this.registry.engine.meshes.getDimensions(this.meshView.getObj())

        this.meshView.getObj().setScale(scale);
        this.meshView.getBounds().setHeight(realDimensions.y);
    }

    protected updateY() {
        const scale = this.meshView.getObj().getScale();

        scale.y = this.initialScale.y * this.getDiffRatio().len();

        this.meshView.getObj().setScale(scale);
    }

    private getDiffRatio() {
        const downDiff =  this.registry.services.pointer.pointer.down.clone().subtract(this.initialBounds.getBoundingCenter());
        const currdiff = this.registry.services.pointer.pointer.curr.clone().subtract(this.initialBounds.getBoundingCenter());
        
        return currdiff.div(downDiff.x, downDiff.y).negateY();
    }
}