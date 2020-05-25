import { IGameObject } from "./IGameObject";
import { PathCorner } from "./PathCorner";
import { ConceptType } from "../../../core/models/views/View";
import { MeshModel } from "../../../core/models/models/MeshModel";
import { PathModel } from "../../../core/models/models/PathModel";

export enum RouteEvent {
    Start = 'Start',
    TurnStart = 'TurnStart',
    TurnEnd = 'TurnEnd',
    Finish = 'Finish'
}

export function getAllRouteEvents() {
    const routeEvents: RouteEvent[] = [];

    for (let item in RouteEvent) {
        if (isNaN(Number(item))) {
            routeEvents.push(<RouteEvent> item);
        }
    }

    return routeEvents;
}

export class RouteObject implements IGameObject {
    readonly type = ConceptType.RouteConcept;
    private readonly eventHandlers: Map<RouteEvent, (() => void)[]> = new Map();
    meshModel: MeshModel;
    pathModel: PathModel;

    constructor(pathModel: PathModel) {
        this.pathModel = pathModel;

        //  TODO generate appropriate id for route
        this.id = `${pathModel.getId()}-route`;
        getAllRouteEvents().forEach(event => this.eventHandlers.set(event, []));
    }
    id: string;
    currentGoal: PathCorner = undefined;
    isTurning = false;
    animation: string;
    isFinished = false;
    repeat = true;
    isPaused = false;
    path: PathCorner[] = [];

    reset() {
        this.currentGoal = undefined;
        this.isFinished = false;
        this.meshModel.meshView.setPosition(this.pathModel.pathView.editPoints[0].point);
    }

    on(event: RouteEvent, handler: () => void) {
        this.eventHandlers.get(event).push(handler);
    }

    trigger(event: RouteEvent) {
        this.eventHandlers.get(event).forEach(handler => handler());
    }

    dispose() {}
}