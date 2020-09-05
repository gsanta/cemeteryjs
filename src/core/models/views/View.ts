import { Rectangle } from "../../../utils/geometry/shapes/Rectangle";
import { Point } from "../../../utils/geometry/shapes/Point";
import { IGameObj } from "../game_objects/IGameObj";

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
}

export enum ViewTag {
    Selected = 'Selected',
    Hovered = 'Hovered'
}

export abstract class View {
    id: string;
    viewType: string;
    tags: Set<ViewTag> = new Set();

    obj: IGameObj;

    dimensions: Rectangle;
    move(delta: Point): void {}
    delete(): View[] { return [this] }

    toJson(): ViewJson {
        return {
            id: this.id,
            type: this.viewType,
            dimensions: this.dimensions ? this.dimensions.toString() : undefined
        };
    }

    fromJson(json: ViewJson, viewMap: Map<string, View>) {
        this.id = json.id;
        this.viewType = json.type;
        this.dimensions = json.dimensions && Rectangle.fromString(json.dimensions);
        viewMap.set(this.id, this);
    }
}