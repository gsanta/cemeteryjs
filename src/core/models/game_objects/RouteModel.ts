import { IGameModel } from "./IGameModel";
import { PathCorner } from "./PathCorner";
import { ViewType } from "../views/View";
import { MeshObj } from "./MeshObj";
import { PathObj } from "./PathObj";
import { RouteWalker } from "./RouteWalker";

export enum RouteEvent {
    Start = 'Start',
    TurnStart = 'TurnStart',
    TurnEnd = 'TurnEnd',
    Finish = 'Finish'
}

export enum TimelineState {
    Playing = 'Playing',
    Paused = 'Paused',
    Stopped = 'Stopped'
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

export class RouteModel implements IGameModel {
    readonly viewType = ViewType.RouteView;
    private readonly eventHandlers: Map<RouteEvent, (() => void)[]> = new Map();

    walker: RouteWalker;
    state: TimelineState = TimelineState.Stopped;
    meshModel: MeshObj;
    pathModel: PathObj;

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
        this.state = TimelineState.Stopped;
        // this.meshModel.meshView.setPosition(this.pathModel.pathView.editPoints[0].point);
    }

    pause() {
        this.state = TimelineState.Paused;
    }

    play() {
        this.state = TimelineState.Playing;
    }

    update() {
        this.state === TimelineState.Playing && this.walker.nextStep();
    }

    on(event: RouteEvent, handler: () => void) {
        this.eventHandlers.get(event).push(handler);
    }

    trigger(event: RouteEvent) {
        this.eventHandlers.get(event).forEach(handler => handler());
    }

    dispose() {}
}