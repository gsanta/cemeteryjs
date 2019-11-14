
interface IEvent {
    type: string;
    handler: () => void;
}

export class EventDispatcher {
    private eventListeners: IEvent[] = [];

    addEventListener(type: string, eventHandler: () => void) {
        var listener: IEvent = {
            type,
            handler: eventHandler
        };
        
        this.eventListeners.push(listener);
    }

    dispatchEvent(eventType) {
        this.eventListeners.forEach(event => {
            if (eventType === event.type) {
                event.handler();
            }
        });
    }
}