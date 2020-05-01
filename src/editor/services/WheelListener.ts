import { Registry } from "../Registry";

function defaultTimeout(callback: Function) {
    setTimeout(callback, 200);
}

export class WheelListener {
    private wheelInProgress = false;
    private wheelCounter = 0;
    private registry: Registry;
    
    private timeout: (callback: Function) => void;

    constructor(registry: Registry, timeout: (callback: Function) => void = defaultTimeout) {
        this.registry = registry;
        this.timeout = timeout;
    }

    onWheel(e: WheelEvent) {
        if (!this.wheelInProgress) {
            this.wheelInProgress = true;
            this.wheelCounter = 0;

            this.listenToWheelEnd();
        } else {
            this.wheelCounter++;
        }

        this.registry.services.mouse.onMouseWheel(e);
    }

    private listenToWheelEnd() {
        const actCounter = this.wheelCounter;

        this.timeout(() => {
            if (actCounter === this.wheelCounter) {
                this.wheelInProgress = false;
                this.registry.services.mouse.onMouseWheelEnd();
            } else {
                this.listenToWheelEnd();
            }
        });
    }
}