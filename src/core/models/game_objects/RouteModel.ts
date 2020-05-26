import { IGameObject } from "../../../game/models/objects/IGameObject";
import { PathCorner } from "../../../game/models/objects/PathCorner";
import { ConceptType } from "../views/View";
import { MeshModel } from "./MeshModel";
import { PathModel } from "./PathModel";
import { RouteWalker } from "../../../game/services/walkers/RouteWalker";

export enum RouteEvent {
    Start = 'Start',
    TurnStart = 'TurnStart',
    TurnEnd = 'TurnEnd',
    Finish = 'Finish'
}

export enum RouteState {
    Playing = 'Walking',
    Finished = 'Finished',
    Paused = 'Paused',
    Reset = 'Reset'
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

export class RouteModel implements IGameObject {
    readonly type = ConceptType.RouteConcept;
    private readonly eventHandlers: Map<RouteEvent, (() => void)[]> = new Map();

    walker: RouteWalker;
    state: RouteState = RouteState.Reset;
    meshModel: MeshModel;
    pathModel: PathModel;

    constructor() {
        this.walker = new RouteWalker(this);
        getAllRouteEvents().forEach(event => this.eventHandlers.set(event, []));
    }
    id: string;
    currentGoal: PathCorner = undefined;
    isTurning = false;
    animation: string;
    repeat = true;
    path: PathCorner[] = [];

    reset() {
        this.currentGoal = undefined;
        this.walker.reset();
        this.state = RouteState.Reset;
        // this.meshModel.meshView.setPosition(this.pathModel.pathView.editPoints[0].point);
    }

    pause() {
        this.state = RouteState.Paused;
    }

    play() {
        this.state = RouteState.Playing;
    }

    update() {
        this.state === RouteState.Playing && this.walker.nextStep();
    }

    on(event: RouteEvent, handler: () => void) {
        this.eventHandlers.get(event).push(handler);
    }

    trigger(event: RouteEvent) {
        this.eventHandlers.get(event).forEach(handler => handler());
    }

    dispose() {}
}