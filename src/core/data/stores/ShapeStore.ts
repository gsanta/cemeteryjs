
import { without } from "../../../utils/geometry/Functions";
import { Polygon } from "../../../utils/geometry/shapes/Polygon";
import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { AbstractCanvasPanel } from "../../models/modules/AbstractCanvasPanel";
import { AbstractShape, ShapeFactory, ShapeTag } from '../../models/shapes/AbstractShape';
import { Registry } from "../../Registry";
import { IdGenerator } from "../IdGenerator";
import { IStore } from "./IStore";

export const sceneAndGameViewRatio = 10;

export function getIntersectingViews(store: IStore<AbstractShape>, rectangle: Rectangle): AbstractShape[] {
    const x = rectangle.topLeft.x;
    const y = rectangle.topLeft.y;
    const width = Math.floor(rectangle.bottomRight.x - rectangle.topLeft.x);
    const height = Math.floor(rectangle.bottomRight.y - rectangle.topLeft.y);

    const polygon = Polygon.createRectangle(x, y, width, height);

    return store.getAll().filter(item => polygon.contains(item.getBounds().toPolygon()));
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
        return this.getAll().filter(item => prop(item) === expectedVal);
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

    add(shape: AbstractShape) {
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

    remove(shape: AbstractShape) {
        if (shape.isSelected()) {
            this.removeSelectedItem(shape);
        }

        shape.deleteConstraiedViews.getViews().forEach(v => this.remove(v));

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

    getById(id: string = ''): AbstractShape {
        if (id.indexOf('/') !== -1) {
            return this.getByFqn(id);
        }
        
        return this.idMap.get(id);
    }

    getByTag(tag: string): AbstractShape[] {
        return [];
    }

    clearTag(tag: string): void {}

    private getByFqn(fqn: string): AbstractShape {
        const ids = fqn.split('/');

        let shape = this.idMap.get(ids[0]);

        for (let i = 1; i < ids.length; i++) {
            shape = shape.containedShapes.find(s => s.id === ids[i]);
        }

        return shape;
    }

    getByType(type: string): AbstractShape[] {
        return this.shapesByType.get(type) || [];
    }

    getAllTypes(): string[] {
        return Array.from(this.shapesByType.keys());
    }

    getAll(): AbstractShape[]  {
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
        this.shapes.forEach(shape => shape.clearTags());
        while(this.shapes.length > 0) {
            this.remove(this.shapes[0]);
        }
        this.idMap = new Map();
        this.shapesByType = new Map();
        this.byObjIdMap = new Map();
        this.idGenerator.clear();
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
			return target.getById(prop);
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
        view.getObj() && this.registry.data.scene.items.remove(view.getObj());
    }
}