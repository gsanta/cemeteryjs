
export enum LifeCycleEvent {
    AfterRender,
    Reset
}

export interface ILifeCycleTrigger {
    activate(trigger: (event: LifeCycleEvent) => void);
}