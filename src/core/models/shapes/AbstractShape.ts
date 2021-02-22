import { Point } from "../../../utils/geometry/shapes/Point";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { FormController } from "../../controller/FormController";
import { UIController } from "../../controller/UIController";
import { AbstractCanvasPanel } from "../modules/AbstractCanvasPanel";
import { Canvas2dPanel } from "../modules/Canvas2dPanel";
import { Registry } from "../../Registry";
import { UI_SvgCanvas } from "../../ui_components/elements/UI_SvgCanvas";
import { IObj } from "../objs/IObj";
import { ChildShapeContext } from "./ChildShapeContext";
import { ChildShape } from "./child_views/ChildShape";
import { CanvasEventType } from "../CanvasObservable";

export interface ShapeJson {
    id: string;
    type: string;
    dimensions: string;
    objId: string;
    parentId: string;
    childViewIds: string[];
}

export enum ShapeTag {
    Selected = 'Selected',
    Hovered = 'Hovered'
}

export interface AfterAllViewsDeserialized {
(): void;
}

export interface ShapeFactory {
    instantiate(): AbstractShape;
    instantiateOnCanvas(canvas: Canvas2dPanel, dimensions: Rectangle, config?: any): AbstractShape;
    instantiateOnSelection(parentView: AbstractShape): void;
}

export abstract class ShapeFactoryAdapter implements ShapeFactory {
    instantiate() { return undefined; }
    instantiateOnCanvas(panel: Canvas2dPanel, dimensions: Rectangle, config?: any): AbstractShape { return undefined; }
    instantiateOnSelection(parentView: AbstractShape): void {  }
}

export interface ShapeRenderer {
    renderInto(container: UI_SvgCanvas, view: AbstractShape, panel: AbstractCanvasPanel<AbstractShape>);
}


export abstract class AbstractShape {
    id: string;
    viewType: string;
    tags: Set<string> = new Set();
    layer: number = 10;

    containerShape: AbstractShape;
    containedShapes: AbstractShape[] = [];

    parentView: AbstractShape;
    childShapes: AbstractShape[] = [];

    controller: FormController = undefined;
    paramController: UIController = {};
    renderer: ShapeRenderer;

    deleteConstraiedViews: ChildShapeContext = new ChildShapeContext();
    readonly canvas: Canvas2dPanel;

    constructor(canvas: Canvas2dPanel) {
        this.canvas = canvas;
    }

    protected obj: IObj;

    protected bounds: Rectangle;
    move(delta: Point): void {}

    private activeContainedView: AbstractShape;

    abstract getObj(): IObj;
    abstract setObj(obj: IObj);

    getFqn() {
        if (this.containerShape) {
            return `${this.containerShape.getFqn()}/${this.id}`;
        }

        return this.id;
    }

    isHovered() {
        return this.tags.has(ShapeTag.Hovered);
    }

    isSelected() {
        return this.tags.has(ShapeTag.Selected);
    }

    addTag(tag: string): void {
        this.tags.add(tag);
        this.canvas.observable.emit({eventType: CanvasEventType.TagChanged})
    }

    hasTag(tag: string): boolean {
        return this.tags.has(tag);
    }

    removeTag(tag: string): void {
        this.tags.delete(tag);
        this.canvas.observable.emit({eventType: CanvasEventType.TagChanged})
    }

    clearTags(): void {
        this.tags.clear();
        this.canvas.observable.emit({eventType: CanvasEventType.TagChanged})
    }

    getAllTags(): string[] {
        return Array.from(this.tags);
    }
    
    setActiveContainedView(containedview: ChildShape) {
        this.activeContainedView = containedview;
    }
    
    getActiveContainedView() {
        return this.activeContainedView;
    }

    isContainedView(): boolean {
        return !!this.containerShape;
    }

    addContainedView(child: ChildShape) {
        this.containedShapes.push(child);
        child.calcBounds();
    }

    deleteContainedView(child: AbstractShape) {
        this.containedShapes.splice(this.containedShapes.indexOf(child), 1);    
    }

    setContainerView(parent: AbstractShape) {
        this.containerShape = parent;
    }

    getChildViews(): AbstractShape[] {
        return this.childShapes;
    }

    getDeleteOnCascadeViews(): AbstractShape[] {
        return [];
    }

    addChildView(view: AbstractShape) {
        this.childShapes = Array.from(new Set([...this.childShapes, view]));
        if (view.parentView !== this) {
            view.setParent(this);
        }
    }

    removeChildView(view: AbstractShape) {
        this.childShapes.splice(this.childShapes.indexOf(view), 1);
    }

    getParent(): AbstractShape {
        return this.parentView;
    }

    setParent(view: AbstractShape) {
        this.parentView = view;
        if (view.getChildViews().indexOf(this) === -1) {
            view.addChildView(this);
        }
    }

    removeParent() {
        this.parentView = undefined;
    }

    abstract getBounds(): Rectangle;
    abstract setBounds(rectangle: Rectangle): void;
    calcBounds(): void {}

    getYPos() { return undefined; }

    abstract dispose(): void;
    clone(): AbstractShape { throw new Error('Not implemented'); }

    toJson(): ShapeJson {
        return {
            id: this.id,
            type: this.viewType,
            dimensions: this.bounds ? this.bounds.toString() : undefined,
            objId: this.obj ? this.obj.id : (this.containerShape && this.containerShape.obj) ? this.containerShape.obj.id : undefined,
            parentId: this.parentView && this.parentView.id,
            childViewIds: this.childShapes.map(view => view.id)
        };
    }

    fromJson(json: ShapeJson, registry: Registry) {
        this.id = json.id;
        this.viewType = json.type;
        this.bounds = json.dimensions && Rectangle.fromString(json.dimensions);
        if (!this.getObj() && json.objId) {
            this.setObj(registry.data.scene.items.getById(json.objId));
        }
    }
}

export function sortViewsByLayer(views: AbstractShape[]): void {
    const layerSorter = (a: AbstractShape, b: AbstractShape) => b.layer - a.layer;

    views.sort(layerSorter);
}
