import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { Point } from "../../../utils/geometry/shapes/Point";
import { IObj } from "../objs/IObj";
import { Registry } from "../../Registry";
import { ChildView } from "./child_views/ChildView";

export enum ViewType {
    MeshView = 'MeshView',
    PathView = 'PathView',
    //TODO: remove it, Route is not a view
    RouteView = 'RouteView',
    NodeView = 'NodeView',
    NodeConnectionView = 'NodeConnectionView' 
}

export interface ViewJson {
    id: string;
    type: string;
    dimensions: string;
    objId: string;
}

export enum ViewTag {
    Selected = 'Selected',
    Hovered = 'Hovered'
}

export interface ViewFactory {
    viewType: string;
    newInstance(): View;
}

export abstract class View {
    id: string;
    viewType: string;
    tags: Set<ViewTag> = new Set();

    parent: View;
    children: View[] = [];

    protected obj: IObj;

    protected bounds: Rectangle;
    move(delta: Point): void {}

    private activeChild: View;

    abstract getObj(): IObj;
    abstract setObj(obj: IObj);

    isHovered() {
        return this.tags.has(ViewTag.Hovered);
    }

    isSelected() {
        return this.tags.has(ViewTag.Selected);
    }

    isChildView(): boolean {
        return !!this.parent;
    }

    setActiveChild(child: ChildView) {
        this.activeChild = child;
    }

    getActiveChild() {
        return this.activeChild;
    }

    deleteChild(child: View) {
        this.children.splice(this.children.indexOf(child), 1);    
    }

    getScale() { return 1; }

    abstract getBounds(): Rectangle;
    abstract setBounds(rectangle: Rectangle): void;

    abstract dispose(): void;

    toJson(): ViewJson {
        return {
            id: this.id,
            type: this.viewType,
            dimensions: this.bounds ? this.bounds.toString() : undefined,
            objId: this.obj ? this.obj.id : (this.parent && this.parent.obj) ? this.parent.obj.id : undefined
        };
    }

    fromJson(json: ViewJson, registry: Registry) {
        this.id = json.id;
        this.viewType = json.type;
        this.bounds = json.dimensions && Rectangle.fromString(json.dimensions);
        this.obj = registry.stores.objStore.getById(json.objId);
    }
}