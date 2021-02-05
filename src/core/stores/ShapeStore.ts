
import { MoveAxisShapeFactory, MoveAxisShapeType } from "../../modules/sketch_editor/main/models/shapes/edit/MoveAxisShape";
import { RotateAxisShapeFactory, RotateAxisShapeType } from "../../modules/sketch_editor/main/models/shapes/edit/RotateAxisShape";
import { ScaleAxisShapeFactory, ScaleAxisShapeType } from "../../modules/sketch_editor/main/models/shapes/edit/ScaleAxisShape";
import { MeshShapeType } from "../../modules/sketch_editor/main/models/shapes/MeshShape";
import { SpriteShapeType } from "../../modules/sketch_editor/main/models/shapes/SpriteShape";
import { without } from "../../utils/geometry/Functions";
import { Polygon } from "../../utils/geometry/shapes/Polygon";
import { Rectangle } from "../../utils/geometry/shapes/Rectangle";
import { AbstractShape, ShapeFactory, ShapeTag } from '../models/shapes/AbstractShape';
import { AbstractCanvasPanel } from "../plugin/AbstractCanvasPanel";
import { Registry } from "../Registry";
import { IdGenerator } from "./IdGenerator";
import { IStore } from "./IStore";

export const sceneAndGameViewRatio = 10;

export function getIntersectingViews(store: IStore<AbstractShape>, rectangle: Rectangle): AbstractShape[] {
    const x = rectangle.topLeft.x;
    const y = rectangle.topLeft.y;
    const width = Math.floor(rectangle.bottomRight.x - rectangle.topLeft.x);
    const height = Math.floor(rectangle.bottomRight.y - rectangle.topLeft.y);

    const polygon = Polygon.createRectangle(x, y, width, height);

    return store.getAllItems().filter(item => polygon.contains(item.getBounds().toPolygon()));
}

export interface ShapeStoreHook {
    addViewHook(view: AbstractShape);
    removeViewHook(view: AbstractShape);
    addSelectionHook(views: AbstractShape[]);
    removeSelectionHook(views: AbstractShape[]);
}

export abstract class EmptyShapeStoreHook implements ShapeStoreHook {
    addViewHook(view: AbstractShape) {}
    removeViewHook(view: AbstractShape) {}
    addSelectionHook(views: AbstractShape[]) {}
    removeSelectionHook(views: AbstractShape[]) {}
}

export class ShapeStore implements IStore<AbstractShape> {
    private shapes: AbstractShape[] = [];
    private selectedViews: AbstractShape[] = [];
    private idMap: Map<string, AbstractShape> = new Map();
    private byObjIdMap: Map<string, AbstractShape> = new Map();
    private shapesByType: Map<string, AbstractShape[]> = new Map();
    private idGenerator: IdGenerator;
    private hooks: ShapeStoreHook[] = [];
    private viewFactories: Map<string, ShapeFactory> = new Map();
    private canvas: AbstractCanvasPanel<AbstractShape>;

    private registry: Registry;

    constructor(registry: Registry, canvas: AbstractCanvasPanel<AbstractShape>) {
        this.registry = registry;
        this.canvas = canvas;
        this.setIdGenerator(new IdGenerator());
    }

    // TODO cache it to make find fast
    find<T>(prop: (item: AbstractShape) => T, expectedVal: T): AbstractShape[] {
        return this.getAllItems().filter(item => prop(item) === expectedVal);
    }

    setIdGenerator(idGenerator: IdGenerator) {
        if (this.idGenerator) {
            throw new Error(`Store already has an id generator, for consistency with the store's content, id generator should be set only once.`);
        }
        this.idGenerator = idGenerator;
    }

    generateId(view: AbstractShape): string {
        return this.idGenerator.generateId(view.viewType);
    }

    addHook(hook: ShapeStoreHook) {
        this.hooks.push(hook);
    }

    removeHook(hook: ShapeStoreHook) {
        this.hooks.splice(this.hooks.indexOf(hook), 1);
    }

    registerViewType(viewType: string, viewFactory: ShapeFactory) {
        this.viewFactories.set(viewType, viewFactory);
    }

    getViewFactory(viewType: string): ShapeFactory {
        return this.viewFactories.get(viewType);
    }

    addItem(shape: AbstractShape) {
        if (!shape.id) {
            shape.id = this.generateId(shape);
        }
        this.idGenerator.registerExistingIdForPrefix(shape.viewType, shape.id);

        this.shapes.push(shape);
        this.idMap.set(shape.id, shape);
        shape.getObj() && this.byObjIdMap.set(shape.getObj().id, shape);

        if (!this.shapesByType.get(shape.viewType)) {
            this.shapesByType.set(shape.viewType, []);
        }

        this.shapesByType.get(shape.viewType).push(shape);
        
        this.hooks.forEach(hook => hook.addViewHook(shape));
    }

    removeItem(shape: AbstractShape) {
        if (shape.isSelected()) {
            this.removeSelectedItem(shape);
        }

        shape.deleteConstraiedViews.getViews().forEach(v => this.removeItem(v));

        this.idGenerator.unregisterExistingIdForPrefix(shape.viewType, shape.id);
        this.idMap.delete(shape.id);
        if (shape.getObj()) {
            this.byObjIdMap.delete(shape.getObj().id);
        }

        const thisViewTypes = this.shapesByType.get(shape.viewType);
        thisViewTypes.splice(thisViewTypes.indexOf(shape), 1);
        this.shapes.splice(this.shapes.indexOf(shape), 1);
        this.selectedViews.indexOf(shape) !== -1 && this.selectedViews.splice(this.selectedViews.indexOf(shape), 1);
        shape.dispose();

        this.hooks.forEach(hook => hook.removeViewHook(shape));
    }

    hasShape(id: string): boolean {
        return this.idMap.has(id);
    }

    getItemById(id: string): AbstractShape {
        return this.idMap.get(id);
    }

    getItemsByType(type: string): AbstractShape[] {
        return this.shapesByType.get(type) || [];
    }

    getAllTypes(): string[] {
        return Array.from(this.shapesByType.keys());
    }

    getAllItems(): AbstractShape[]  {
        return this.shapes;
    }

    addSelectedItem(...items: AbstractShape[]) {
        items.forEach(item => item.tags.add(ShapeTag.Selected));
        this.selectedViews.push(...items);

        this.hooks.forEach(hook => hook.addSelectionHook(items));
        this.registry.services.event.select.emit();
    }

    removeSelectedItem(item: AbstractShape) {
        item.tags.delete(ShapeTag.Selected)
        this.selectedViews = without(this.selectedViews, item);

        this.hooks.forEach(hook => hook.removeSelectionHook([item]));
        this.registry.services.event.select.emit();
    }

    clear() {
        while(this.shapes.length > 0) {
            this.removeItem(this.shapes[0]);
        }
        this.idMap = new Map();
        this.shapesByType = new Map();
        this.byObjIdMap = new Map();
        this.idGenerator.clear();
        this.canvas.data.selection.clear();
    }

    static newInstance(registry: Registry, canvas: AbstractCanvasPanel<AbstractShape>): ShapeStore {
        const viewStore = new ShapeStore(registry, canvas);
        const proxy = new Proxy(viewStore, handler);
        return proxy;
    }
}

const handler = {
    get: function(target: ShapeStore, prop, receiver) {
		var propValue = target[prop];
        if (typeof propValue != "function") {
			return target.getItemById(prop);
		}
		else{
			return function(){
				//"this" points to the proxy, is like using the "receiver" that the proxy has captured
				return propValue.apply(target, arguments);
			}
		}
    }
};

export class ShapeLifeCycleHook extends EmptyShapeStoreHook {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    removeViewHook(view: AbstractShape) {
        view.getObj() && this.registry.stores.objStore.removeItem(view.getObj());
    }
}

export class AxisControlHook extends EmptyShapeStoreHook {
    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
    }

    addSelectionHook(views: AbstractShape[]) {
        if (views.length === 1 && (views[0].viewType === SpriteShapeType || views[0].viewType === MeshShapeType)) {
            new MoveAxisShapeFactory(this.registry).instantiateOnSelection(views[0])
            new ScaleAxisShapeFactory(this.registry).instantiateOnSelection(views[0])
            new RotateAxisShapeFactory(this.registry).instantiateOnSelection(views[0])
        }
    }

    removeSelectionHook(views: AbstractShape[]) {
        views.forEach(view => {
            view.containedShapes.filter(view => view.viewType === MoveAxisShapeType).forEach(child => view.deleteContainedView(child));
            view.containedShapes.filter(view => view.viewType === ScaleAxisShapeType).forEach(child => view.deleteContainedView(child));
            view.containedShapes.filter(view => view.viewType === RotateAxisShapeType).forEach(child => view.deleteContainedView(child));
        });
    }
}