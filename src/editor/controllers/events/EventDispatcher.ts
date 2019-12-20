
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

    removeEventListener(handler: () => void) {
        const listenerIndex = this.eventListeners.findIndex(listener => listener.handler === handler);

        this.eventListeners.splice(listenerIndex, 1);
    }

    dispatchEvent(eventType) {
        this.eventListeners.forEach(event => {
            if (eventType === event.type) {
                event.handler();
            }
        });
    }
}