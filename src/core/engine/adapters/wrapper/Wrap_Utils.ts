

export function executeEnginesUntilValReturned<T>(callback: (index: number) => T): T {
    for (let i = 0; i < this.engineFacade.engines.length; i++) {
        const val = <T> callback(i);
        if (val !== undefined) {
            return val;
        }
    }
}