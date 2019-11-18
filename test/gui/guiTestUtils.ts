import { ControllerFacade } from '../../src/gui/controllers/ControllerFacade';
import { UIUpdateController } from '../../src/gui/controllers/UIUpdateController';
import { SvgCanvasController } from '../../src/gui/controllers/canvases/svg/SvgCanvasController';
import { FileFormat } from '../../src/WorldGenerator';


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
    <rect width="10px" height="10px" x="20px" y="20px" fill="#7B7982" data-wg-x="20" data-wg-y="20" data-wg-type="wall" />
    <rect width="10px" height="10px" x="30px" y="20px" fill="#7B7982" data-wg-x="30" data-wg-y="20" data-wg-type="wall" />
    <rect width="10px" height="10px" x="40px" y="20px" fill="#7B7982" data-wg-x="40" data-wg-y="20" data-wg-type="wall" />
    <rect width="10px" height="10px" x="50px" y="20px" fill="#7B7982" data-wg-x="50" data-wg-y="20" data-wg-type="wall" />
    <rect width="10px" height="10px" x="60px" y="20px" fill="#7B7982" data-wg-x="60" data-wg-y="20" data-wg-type="wall" />
    <rect width="10px" height="10px" x="20px" y="30px" fill="#7B7982" data-wg-x="20" data-wg-y="30" data-wg-type="wall" />
    <rect width="10px" height="10px" x="20px" y="40px" fill="#7B7982" data-wg-x="20" data-wg-y="40" data-wg-type="wall" />
    <rect width="10px" height="10px" x="20px" y="50px" fill="#7B7982" data-wg-x="20" data-wg-y="50" data-wg-type="wall" />
    <rect width="10px" height="10px" x="20px" y="60px" fill="#7B7982" data-wg-x="20" data-wg-y="60" data-wg-type="wall" />
    <rect width="10px" height="10px" x="30px" y="60px" fill="#7B7982" data-wg-x="30" data-wg-y="60" data-wg-type="wall" />
    <rect width="10px" height="10px" x="40px" y="60px" fill="#7B7982" data-wg-x="40" data-wg-y="60" data-wg-type="wall" />
    <rect width="10px" height="10px" x="50px" y="60px" fill="#7B7982" data-wg-x="50" data-wg-y="60" data-wg-type="wall" />
    <rect width="10px" height="10px" x="60px" y="60px" fill="#7B7982" data-wg-x="60" data-wg-y="60" data-wg-type="wall" />
    <rect width="10px" height="10px" x="70px" y="20px" fill="#7B7982" data-wg-x="70" data-wg-y="20" data-wg-type="wall" />
    <rect width="10px" height="10px" x="70px" y="30px" fill="#7B7982" data-wg-x="70" data-wg-y="30" data-wg-type="wall" />
    <rect width="10px" height="10px" x="70px" y="40px" fill="#7B7982" data-wg-x="70" data-wg-y="40" data-wg-type="wall" />
    <rect width="10px" height="10px" x="70px" y="50px" fill="#7B7982" data-wg-x="70" data-wg-y="50" data-wg-type="wall" />
    <rect width="10px" height="10px" x="70px" y="60px" fill="#7B7982" data-wg-x="70" data-wg-y="60" data-wg-type="wall" />
    <rect width="10px" height="10px" x="30px" y="30px" data-wg-x="30" data-wg-y="30" data-wg-type="room" />
    <rect width="10px" height="10px" x="30px" y="40px" data-wg-x="30" data-wg-y="40" data-wg-type="room" />
    <rect width="10px" height="10px" x="30px" y="50px" data-wg-x="30" data-wg-y="50" data-wg-type="room" />
    <rect width="10px" height="10px" x="40px" y="50px" data-wg-x="40" data-wg-y="50" data-wg-type="room" />
    <rect width="10px" height="10px" x="50px" y="50px" data-wg-x="50" data-wg-y="50" data-wg-type="room" />
    <rect width="10px" height="10px" x="60px" y="50px" data-wg-x="60" data-wg-y="50" data-wg-type="room" />
    <rect width="10px" height="10px" x="40px" y="30px" data-wg-x="40" data-wg-y="30" data-wg-type="room" />
    <rect width="10px" height="10px" x="50px" y="30px" data-wg-x="50" data-wg-y="30" data-wg-type="room" />
    <rect width="10px" height="10px" x="60px" y="30px" data-wg-x="60" data-wg-y="30" data-wg-type="room" />
    <rect width="10px" height="10px" x="40px" y="40px" data-wg-x="40" data-wg-y="40" data-wg-type="room" />
    <rect width="10px" height="10px" x="50px" y="40px" data-wg-x="50" data-wg-y="40" data-wg-type="room" />
    <rect width="10px" height="10px" x="60px" y="40px" data-wg-x="60" data-wg-y="40" data-wg-type="room" />
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
    (<SvgCanvasController> controllers.getCanvasControllerById(SvgCanvasController.id)).writer.write(defaultTestSvg, FileFormat.SVG);
    controllers.updateUIController = new MockRenderController();

    return controllers;
}