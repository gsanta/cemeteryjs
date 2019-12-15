import { ControllerFacade } from '../../../src/gui/controllers/ControllerFacade';
import { UIUpdateController } from '../../../src/gui/controllers/UIUpdateController';
import { SvgCanvasController } from '../../../src/gui/controllers/canvases/svg/SvgCanvasController';
import { FileFormat } from '../../../src/WorldGenerator';


const defaultTestSvg = `
<svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000">
    <metadata>
        <wg-type color="#7B7982" is-border="true" scale="1" translate-y="0" type-name="wall" shape="rect" />
        <wg-type color="#BFA85C" is-border="true" scale="3" translate-y="-4" type-name="door" />
        <wg-type is-border="false" scale="1" translate-y="0" type-name="table" />
        <wg-type color="#70C0CF" is-border="true" scale="3" translate-y="0" type-name="window" />
        <wg-type color="#9894eb" is-border="false" scale="3" translate-y="0" type-name="chair" />
        <wg-type color="#8c7f6f" is-border="false" scale="3" translate-y="1" type-name="shelves" />
        <wg-type color="#66553f" is-border="false" scale="3" translate-y="2" type-name="stairs" />
        <wg-type is-border="false" scale="1" translate-y="0" type-name="outdoors" />
        <wg-type is-border="false" scale="1" translate-y="0" type-name="room" />
        <wg-type is-border="false" scale="1" translate-y="0" type-name="player" />
    </metadata>
    <rect width="10px" height="10px" x="410px" y="120px" fill="red" data-wg-x="10" data-wg-y="10" data-wg-width="10" data-wg-height="10" data-wg-type="building"></rect>
</svg>
`;

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
    controllers.webglCanvasController.unregisterEvents();
    controllers.svgCanvasController.writer.write(defaultTestSvg);
    controllers.updateUIController = new MockRenderController();

    return controllers;
}