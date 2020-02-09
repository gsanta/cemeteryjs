
export enum LifeCycleEvent {
    AfterRender = 'AfterRender',
    Reset = 'Reset'
}

export interface ILifeCycleTrigger {
    activate(trigger: (event: LifeCycleEvent) => void);
}