import { Rectangle } from "../../geometry/shapes/Rectangle";
import { Point } from "../../geometry/shapes/Point";

export enum ConceptType {
    MeshConcept = 'MeshConcept',
    ModelConcept = 'ModelConcept',
    PathConcept = 'PathConcept',
    AnimationConcept = 'AnimationConcept',
    RouteConcept = 'RouteConcept',
    ActionConcept = 'ActionConcept',
    ActionNodeConnectionConcept = 'ActionNodeConnectionConcept' 
}

export interface ViewJson {
    type: string;
    dimensions: string;
}

export abstract class View {
    id: string;
    type: string;

    
    dimensions: Rectangle;
    move(delta: Point): void {}
    delete(): View[] { return [this] }

    toJson(): ViewJson {
        return {
            type: this.type,
            dimensions: this.dimensions.toString()
        };
    }

    fromJson(json: ViewJson) {
        this.type = json.type;
        this.dimensions = Rectangle.fromString(json.dimensions);
    }
}