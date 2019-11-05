import { ControllerFacade } from '../../src/gui/controllers/ControllerFacade';
import { RenderController } from '../../src/gui/controllers/RenderController';

export class MockRenderController extends RenderController {
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
    controllers.renderController = new MockRenderController();

    return controllers;
}