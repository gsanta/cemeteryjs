import { ServiceLocator } from "./ServiceLocator";

function defaultTimeout(callback: Function) {
    setTimeout(callback, 200);
}

export class WheelListener {
    private wheelInProgress = false;
    private wheelCounter = 0;
    private getServices: () => ServiceLocator;

    private timeout: (callback: Function) => void;

    constructor(getServices: () => ServiceLocator, timeout: (callback: Function) => void = defaultTimeout) {
        this.getServices = getServices;
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

        this.getServices().mouseService().onMouseWheel(e);
    }

    private listenToWheelEnd() {
        const actCounter = this.wheelCounter;

        this.timeout(() => {
            if (actCounter === this.wheelCounter) {
                this.wheelInProgress = false;
                this.getServices().mouseService().onMouseWheelEnd();
            } else {
                this.listenToWheelEnd();
            }
        });
    }
}