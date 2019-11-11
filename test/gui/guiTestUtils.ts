import { ControllerFacade } from '../../src/gui/controllers/ControllerFacade';
import { UIUpdateController } from '../../src/gui/controllers/UIUpdateController';

export class MockRenderController extends UIUpdateController {
    private renderCounter = 0;

    getRenderCount() {
        return this.renderCounter;
    }

    resetRenderCount() {
        this.renderCounter = 0;
    }

    render(): void {
        this.renderCounter++;
    }
}

export function setupControllers(): ControllerFacade {
    const controllers = new ControllerFacade();
    controllers.updateUIController = new MockRenderController();

    return controllers;
}