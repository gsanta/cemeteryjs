
export class UIUpdateController {
    private updateFunc: () => void;

    setUpdateFunc(updateFunc: () => void) {
        this.updateFunc = updateFunc;
    }

    updateUI(): void {
        if (this.updateFunc) {
            this.updateFunc();
        }
    }
}