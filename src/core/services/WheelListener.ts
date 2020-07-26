import { Registry } from "../Registry";

function defaultTimeout(callback: Function) {
    setTimeout(callback, 200);
}

export class WheelListener {
    private wheelInProgress = false;
    private wheelCounter = 0;
    private registry: Registry;
    
    private timeout: (callback: Function) => void;

    private wheelCallback: (e: WheelEvent) => void;
    private wheelEndCallback: () => void

    constructor(
        registry: Registry,
        wheelCallback: (e: WheelEvent) => void,
        wheelEndCallback: () => void,
        timeout: (callback: Function) => void = defaultTimeout,
    ) {
        this.registry = registry;
        this.timeout = timeout;
        this.wheelCallback = wheelCallback;
        this.wheelEndCallback = wheelEndCallback;
    }

    onWheel(e: WheelEvent) {
        if (!this.wheelInProgress) {
            this.wheelInProgress = true;
            this.wheelCounter = 0;

            this.listenToWheelEnd();
        } else {
            this.wheelCounter++;
        }

        this.wheelCallback(e);
    }

    private listenToWheelEnd() {
        const actCounter = this.wheelCounter;

        this.timeout(() => {
            if (actCounter === this.wheelCounter) {
                this.wheelInProgress = false;
                this.wheelEndCallback();
            } else {
                this.listenToWheelEnd();
            }
        });
    }
}