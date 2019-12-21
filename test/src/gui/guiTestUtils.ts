import { ControllerFacade } from '../../../src/editor/controllers/ControllerFacade';
import { Point } from '../../../src/model/geometry/shapes/Point';
import { CanvasItem } from '../../../src/editor/controllers/formats/svg/models/GridCanvasStore';


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

class MockRenderer {
    counter: number = 0;

    constructor() {
        this.render = this.render.bind(this);
    }

    render() {
        this.counter++;
    }

    reset() {
        this.counter = 0;
    }
}

export class ControllerFacadeExt extends ControllerFacade {
    svgCanvasRenderer = new MockRenderer();

    constructor() {
        super();

        this.webglCanvasController.unregisterEvents();
        
        this.svgCanvasController.writer.write(defaultTestSvg);
        this.svgCanvasController.setCanvasRenderer(this.svgCanvasRenderer.render);
    }
}

export function setupControllers(): ControllerFacadeExt {
    return new ControllerFacadeExt();
}

export function drag(controllers: ControllerFacade, from: Point, to: Point) {
    const svgController = controllers.svgCanvasController;
    svgController.mouseController.onMouseMove(<MouseEvent> {x: from.x, y: from.y});
    svgController.mouseController.onMouseDown(<MouseEvent> {x: from.x, y: from.y});
    svgController.mouseController.onMouseMove(<MouseEvent> {x: to.x, y: to.y});
    svgController.mouseController.onMouseUp(<MouseEvent> {x: to.x, y: to.y});
}

export function drawRectangle(controllers: ControllerFacade, topLeft = new Point(50, 50), bottomRight = new Point(250, 150)): CanvasItem {
    const svgController = controllers.svgCanvasController;
    svgController.mouseController.onMouseMove(<MouseEvent> {x: topLeft.x, y: topLeft.y});
    svgController.mouseController.onMouseDown(<MouseEvent> {x: topLeft.x, y: topLeft.y});
    svgController.mouseController.onMouseMove(<MouseEvent> {x: bottomRight.x, y: bottomRight.y});
    svgController.mouseController.onMouseUp(<MouseEvent> {x: bottomRight.x, y: bottomRight.y});

    return svgController.pixelModel.items[svgController.pixelModel.items.length - 1];
}

export function selectWithRect(controllers: ControllerFacade, from: Point, to: Point) {
    const svgController = controllers.svgCanvasController;
    svgController.mouseController.onMouseMove(<MouseEvent> {x: from.x, y: from.y});
    svgController.mouseController.onMouseDown(<MouseEvent>{x: from.x, y: from.y});
    svgController.mouseController.onMouseMove(<MouseEvent> {x: to.x, y: to.y});
    svgController.mouseController.onMouseUp(<MouseEvent> {x: to.x, y: to.y});
}

export function click(controllers: ControllerFacade, canvasItem: CanvasItem) {
    const svgController = controllers.svgCanvasController;
    const center = canvasItem.dimensions.getBoundingCenter().mul(controllers.svgCanvasController.configModel.pixelSize);
    svgController.mouseController.onMouseMove(<MouseEvent> {x: center.x, y: center.y});
    svgController.mouseController.hover(canvasItem);
    svgController.mouseController.onMouseDown(<MouseEvent>{x: center.x, y: center.y});
    svgController.mouseController.onMouseUp(<MouseEvent> {x: center.x, y: center.y});
}