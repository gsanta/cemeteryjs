import { FileFormat } from '../../../../WorldGenerator';
import { defaultWorldItemDefinitions } from '../../../configs/defaultWorldItemDefinitions';
import { ControllerFacade } from '../../ControllerFacade';
import { WorldItemDefinitionForm } from '../../world_items/WorldItemDefinitionForm';
import { WorldItemDefinitionModel } from '../../world_items/WorldItemDefinitionModel';
import { ICanvasReader } from '../ICanvasReader';
import { ICanvasWriter } from '../ICanvasWriter';
import { IEditableCanvas } from '../IEditableCanvas';
import { MouseHandler } from './handlers/MouseHandler';
import { PixelModel } from './models/PixelModel';
import { SelectionModel } from './models/SelectionModel';
import { SvgConfig as SvgConfig } from './models/SvgConfig';
import { SvgCanvasReader } from './SvgCanvasReader';
import { SvgCanvasWriter } from './SvgCanvasWriter';
import { DeleteTool } from './tools/DeleteTool';
import { RectangleTool } from './tools/RectangleTool';
import { Tool, ToolType } from './tools/Tool';

export const initialSvg = 
`
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

export class SvgCanvasController implements IEditableCanvas {
    static id = 'svg-canvas-controller';
    fileFormats = [FileFormat.SVG];
    mouseController: MouseHandler;
    activeTool: Tool;
    tools: Tool[];
    writer: ICanvasWriter;
    reader: ICanvasReader;
    
    configModel: SvgConfig;
    pixelModel: PixelModel;
    selectionModel: SelectionModel;
    
    controllers: ControllerFacade;
    WorldItemDefinitionForm: WorldItemDefinitionForm;
    worldItemDefinitionModel: WorldItemDefinitionModel;

    private renderFunc: () => void;
    
    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
        this.worldItemDefinitionModel = new WorldItemDefinitionModel(defaultWorldItemDefinitions);
        this.WorldItemDefinitionForm = new WorldItemDefinitionForm(this);

        this.selectionModel = new SelectionModel();
        this.configModel = new SvgConfig();
        this.pixelModel = new PixelModel(this.configModel);
        
        this.mouseController = new MouseHandler(this);
        this.writer = new SvgCanvasWriter(this, controllers.eventDispatcher);
        this.reader = new SvgCanvasReader(this);

        this.tools = [
            new RectangleTool(this),
            new DeleteTool(this)
        ];

        this.activeTool = this.tools[0];
        this.writer.write(initialSvg, FileFormat.SVG);
    }

    render() {
        if (this.renderFunc) {
            this.renderFunc();
        }
    }

    setActiveTool(toolType: ToolType) {
        this.activeTool = this.tools.find(tool => tool.type === toolType);
        this.render();
    }

    getId() {
        return SvgCanvasController.id;
    }

    resize(): void {};

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }

    activate(): void {
        // this.
    }
}