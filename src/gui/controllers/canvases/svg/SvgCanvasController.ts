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
    <wg-type color="#7B7982" is-border="true" scale="1" translate-y="0" type-name="wall" shape="rect"></wg-type>
    <wg-type color="#BFA85C" is-border="true" scale="3" translate-y="-4" type-name="door" materials="assets/models/door/door_material.png" model="assets/models/door/door.babylon"></wg-type>
    <wg-type is-border="false" scale="0.5" translate-y="0" type-name="table" color="#c5541b" materials="assets/models/table_material.png" model="assets/models/table.babylon"></wg-type>
    <wg-type color="#70C0CF" is-border="true" scale="3" translate-y="0" type-name="window" materials="assets/models/window.png" model="assets/models/table.babylon"></wg-type>
    <wg-type color="#9894eb" is-border="false" scale="3" translate-y="0" type-name="chair"></wg-type>
    <wg-type color="#8c7f6f" is-border="false" scale="3" translate-y="1" type-name="shelves"></wg-type>
    <wg-type color="#66553f" is-border="false" scale="3" translate-y="2" type-name="stairs"></wg-type>
    <wg-type is-border="false" scale="1" translate-y="0" type-name="outdoors"></wg-type>
    <wg-type is-border="false" scale="1" translate-y="0" type-name="room"></wg-type>
    <wg-type is-border="false" scale="1" translate-y="0" type-name="player"></wg-type>
</metadata>
<rect width="10px" height="10px" x="50px" y="30px" fill="#7B7982" data-wg-x="50" data-wg-y="30" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="60px" y="30px" fill="#7B7982" data-wg-x="60" data-wg-y="30" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="70px" y="30px" fill="#7B7982" data-wg-x="70" data-wg-y="30" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="80px" y="30px" fill="#7B7982" data-wg-x="80" data-wg-y="30" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="90px" y="30px" fill="#7B7982" data-wg-x="90" data-wg-y="30" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="100px" y="30px" fill="#7B7982" data-wg-x="100" data-wg-y="30" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="110px" y="30px" fill="#7B7982" data-wg-x="110" data-wg-y="30" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="120px" y="30px" fill="#7B7982" data-wg-x="120" data-wg-y="30" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="50px" y="40px" fill="#7B7982" data-wg-x="50" data-wg-y="40" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="50px" y="50px" fill="#7B7982" data-wg-x="50" data-wg-y="50" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="50px" y="60px" fill="#7B7982" data-wg-x="50" data-wg-y="60" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="50px" y="70px" fill="#7B7982" data-wg-x="50" data-wg-y="70" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="50px" y="80px" fill="#7B7982" data-wg-x="50" data-wg-y="80" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="50px" y="90px" fill="#7B7982" data-wg-x="50" data-wg-y="90" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="60px" y="90px" fill="#7B7982" data-wg-x="60" data-wg-y="90" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="70px" y="90px" fill="#7B7982" data-wg-x="70" data-wg-y="90" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="80px" y="90px" fill="#7B7982" data-wg-x="80" data-wg-y="90" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="90px" y="90px" fill="#7B7982" data-wg-x="90" data-wg-y="90" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="100px" y="90px" fill="#7B7982" data-wg-x="100" data-wg-y="90" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="110px" y="90px" fill="#7B7982" data-wg-x="110" data-wg-y="90" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="120px" y="90px" fill="#7B7982" data-wg-x="120" data-wg-y="90" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="130px" y="30px" fill="#7B7982" data-wg-x="130" data-wg-y="30" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="130px" y="40px" fill="#7B7982" data-wg-x="130" data-wg-y="40" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="130px" y="50px" fill="#7B7982" data-wg-x="130" data-wg-y="50" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="130px" y="60px" fill="#7B7982" data-wg-x="130" data-wg-y="60" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="130px" y="70px" fill="#7B7982" data-wg-x="130" data-wg-y="70" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="130px" y="80px" fill="#7B7982" data-wg-x="130" data-wg-y="80" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="130px" y="90px" fill="#7B7982" data-wg-x="130" data-wg-y="90" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="100px" y="40px" data-wg-x="100" data-wg-y="40" data-wg-type="table" fill="#c5541b"></rect>
<rect width="10px" height="10px" x="100px" y="50px" data-wg-x="100" data-wg-y="50" data-wg-type="table" fill="#c5541b"></rect>
<rect width="10px" height="10px" x="100px" y="60px" data-wg-x="100" data-wg-y="60" data-wg-type="table" fill="#c5541b"></rect>
<rect width="10px" height="10px" x="110px" y="40px" data-wg-x="110" data-wg-y="40" data-wg-type="table" fill="#c5541b"></rect>
<rect width="10px" height="10px" x="110px" y="50px" data-wg-x="110" data-wg-y="50" data-wg-type="table" fill="#c5541b"></rect>
<rect width="10px" height="10px" x="110px" y="60px" data-wg-x="110" data-wg-y="60" data-wg-type="table" fill="#c5541b"></rect>
<rect width="10px" height="10px" x="120px" y="40px" data-wg-x="120" data-wg-y="40" data-wg-type="table" fill="#c5541b"></rect>
<rect width="10px" height="10px" x="120px" y="50px" data-wg-x="120" data-wg-y="50" data-wg-type="table" fill="#c5541b"></rect>
<rect width="10px" height="10px" x="120px" y="60px" data-wg-x="120" data-wg-y="60" data-wg-type="table" fill="#c5541b"></rect>
<rect width="10px" height="10px" x="60px" y="40px" data-wg-x="60" data-wg-y="40" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="60px" y="50px" data-wg-x="60" data-wg-y="50" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="60px" y="60px" data-wg-x="60" data-wg-y="60" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="60px" y="70px" data-wg-x="60" data-wg-y="70" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="60px" y="80px" data-wg-x="60" data-wg-y="80" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="70px" y="40px" data-wg-x="70" data-wg-y="40" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="70px" y="50px" data-wg-x="70" data-wg-y="50" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="70px" y="60px" data-wg-x="70" data-wg-y="60" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="70px" y="70px" data-wg-x="70" data-wg-y="70" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="70px" y="80px" data-wg-x="70" data-wg-y="80" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="80px" y="40px" data-wg-x="80" data-wg-y="40" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="80px" y="50px" data-wg-x="80" data-wg-y="50" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="80px" y="60px" data-wg-x="80" data-wg-y="60" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="80px" y="70px" data-wg-x="80" data-wg-y="70" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="80px" y="80px" data-wg-x="80" data-wg-y="80" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="90px" y="40px" data-wg-x="90" data-wg-y="40" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="90px" y="50px" data-wg-x="90" data-wg-y="50" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="90px" y="60px" data-wg-x="90" data-wg-y="60" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="90px" y="70px" data-wg-x="90" data-wg-y="70" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="90px" y="80px" data-wg-x="90" data-wg-y="80" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="100px" y="70px" data-wg-x="100" data-wg-y="70" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="100px" y="80px" data-wg-x="100" data-wg-y="80" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="110px" y="70px" data-wg-x="110" data-wg-y="70" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="110px" y="80px" data-wg-x="110" data-wg-y="80" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="120px" y="70px" data-wg-x="120" data-wg-y="70" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="120px" y="80px" data-wg-x="120" data-wg-y="80" data-wg-type="room"></rect>
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
    worldItemDefinitionForm: WorldItemDefinitionForm;
    worldItemDefinitionModel: WorldItemDefinitionModel;

    private renderFunc: () => void;
    
    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
        this.worldItemDefinitionModel = new WorldItemDefinitionModel(defaultWorldItemDefinitions);
        this.worldItemDefinitionForm = new WorldItemDefinitionForm(this);

        this.selectionModel = new SelectionModel();
        this.configModel = new SvgConfig();
        this.pixelModel = new PixelModel(this.configModel);
        
        this.mouseController = new MouseHandler(this);
        this.writer = new SvgCanvasWriter(this, controllers.eventDispatcher);
        this.reader = new SvgCanvasReader(this);

        this.tools = [
            new RectangleTool(this, this.controllers.eventDispatcher),
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