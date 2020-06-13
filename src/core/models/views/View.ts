import { Rectangle } from "../../geometry/shapes/Rectangle";
import { Point } from "../../geometry/shapes/Point";

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

export abstract class View {
    id: string;
    viewType: string;

    
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