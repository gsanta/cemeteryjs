import { ShapeEventData, ShapeEventType, ShapeObservable } from "../../../../../core/models/ShapeObservable";
import { AbstractShape } from "../../../../../core/models/shapes/AbstractShape";
import { AbstractCanvasPanel } from "../../../../../core/plugin/AbstractCanvasPanel";
import { Registry } from "../../../../../core/Registry";
import { Point_3 } from "../../../../../utils/geometry/shapes/Point_3";
import { Rectangle } from "../../../../../utils/geometry/shapes/Rectangle";
import { ScaleAxisView, ScaleAxisShapeType, ScaleAxisShapeFactory } from "../../models/shapes/edit/ScaleAxisShape";
import { AbstractAxisTool } from "./AbstractAxisTool";

export const ScaleAxisToolId = 'scale-axis-tool';

export class ScaleAxisTool extends AbstractAxisTool<ScaleAxisView> {
    private initialScale: Point_3;
    private initialBounds: Rectangle;

    constructor(canvas: AbstractCanvasPanel<AbstractShape>, registry: Registry, shapeObservable: ShapeObservable) {
        super(ScaleAxisToolId, canvas, registry, shapeObservable, ScaleAxisShapeType);
    }

    down() {
        super.down();
        if (this.meshShape) {
            this.initialScale = this.meshShape.getObj().getScale();
            this.initialBounds = this.meshShape.getBounds().clone();
        }
    }

    up() {
        super.up();
        this.initialScale = undefined;
        this.initialBounds = undefined;
    }

    protected updateX() {
        const scale = this.meshShape.getObj().getScale();
        scale.x = this.initialScale.x * this.getDiffRatio().x;

        const realDimensions = this.registry.engine.meshes.getDimensions(this.meshShape.getObj())
        
        this.meshShape.getObj().setScale(scale);
        this.meshShape.getBounds().setWidth(realDimensions.x);
    }

    protected updateZ() {
        const scale = this.meshShape.getObj().getScale();

        scale.z = this.initialScale.z * this.getDiffRatio().y;

        const realDimensions = this.registry.engine.meshes.getDimensions(this.meshShape.getObj())

        this.meshShape.getObj().setScale(scale);
        this.meshShape.getBounds().setHeight(realDimensions.y);
    }

    protected updateY() {
        const scale = this.meshShape.getObj().getScale();

        scale.y = this.initialScale.y * this.getDiffRatio().len();

        this.meshShape.getObj().setScale(scale);
    }

    protected instantiate() {
        new ScaleAxisShapeFactory(this.registry).instantiateOnSelection(this.meshShape);
    }

    protected remove() {
        this.meshShape.containedShapes
            .filter(shape => shape.viewType === ScaleAxisShapeType)
            .forEach(child => this.meshShape.deleteContainedView(child));
    }

    private getDiffRatio() {
        const downDiff =  this.canvas.pointer.pointer.down.clone().subtract(this.initialBounds.getBoundingCenter());
        const currdiff = this.canvas.pointer.pointer.curr.clone().subtract(this.initialBounds.getBoundingCenter());
        
        return currdiff.div(downDiff.x, downDiff.y).negateY();
    }
}