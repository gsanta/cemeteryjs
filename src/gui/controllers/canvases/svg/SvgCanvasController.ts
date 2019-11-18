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
<svg data-wg-pixel-size="10" data-wg-width="1500" data-wg-height="1000" class="sc-bxivhb eycvSb">
<metadata>
    <wg-type color="brown" is-border="true" scale="1" translate-y="0" type-name="wall"></wg-type>
    <wg-type color="#f30101" is-border="false" scale="1" translate-y="0" type-name="room"></wg-type>
</metadata>
<rect width="10px" height="10px" x="40px" y="40px" fill="brown" data-wg-x="40" data-wg-y="40" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="50px" y="40px" fill="brown" data-wg-x="50" data-wg-y="40" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="60px" y="40px" fill="brown" data-wg-x="60" data-wg-y="40" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="70px" y="40px" fill="brown" data-wg-x="70" data-wg-y="40" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="80px" y="40px" fill="brown" data-wg-x="80" data-wg-y="40" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="90px" y="40px" fill="brown" data-wg-x="90" data-wg-y="40" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="100px" y="40px" fill="brown" data-wg-x="100" data-wg-y="40" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="110px" y="40px" fill="brown" data-wg-x="110" data-wg-y="40" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="120px" y="40px" fill="brown" data-wg-x="120" data-wg-y="40" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="40px" y="50px" fill="brown" data-wg-x="40" data-wg-y="50" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="40px" y="60px" fill="brown" data-wg-x="40" data-wg-y="60" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="40px" y="70px" fill="brown" data-wg-x="40" data-wg-y="70" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="40px" y="80px" fill="brown" data-wg-x="40" data-wg-y="80" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="40px" y="90px" fill="brown" data-wg-x="40" data-wg-y="90" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="40px" y="100px" fill="brown" data-wg-x="40" data-wg-y="100" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="50px" y="100px" fill="brown" data-wg-x="50" data-wg-y="100" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="60px" y="100px" fill="brown" data-wg-x="60" data-wg-y="100" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="70px" y="100px" fill="brown" data-wg-x="70" data-wg-y="100" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="80px" y="100px" fill="brown" data-wg-x="80" data-wg-y="100" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="90px" y="100px" fill="brown" data-wg-x="90" data-wg-y="100" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="100px" y="100px" fill="brown" data-wg-x="100" data-wg-y="100" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="110px" y="100px" fill="brown" data-wg-x="110" data-wg-y="100" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="120px" y="100px" fill="brown" data-wg-x="120" data-wg-y="100" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="120px" y="50px" fill="brown" data-wg-x="120" data-wg-y="50" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="120px" y="60px" fill="brown" data-wg-x="120" data-wg-y="60" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="120px" y="70px" fill="brown" data-wg-x="120" data-wg-y="70" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="120px" y="80px" fill="brown" data-wg-x="120" data-wg-y="80" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="120px" y="90px" fill="brown" data-wg-x="120" data-wg-y="90" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="90px" y="70px" fill="brown" data-wg-x="90" data-wg-y="70" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="100px" y="70px" fill="brown" data-wg-x="100" data-wg-y="70" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="110px" y="70px" fill="brown" data-wg-x="110" data-wg-y="70" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="90px" y="50px" fill="brown" data-wg-x="90" data-wg-y="50" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="90px" y="60px" fill="brown" data-wg-x="90" data-wg-y="60" data-wg-type="wall"></rect>
<rect width="10px" height="10px" x="50px" y="50px" fill="#f30101" data-wg-x="50" data-wg-y="50" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="50px" y="60px" fill="#f30101" data-wg-x="50" data-wg-y="60" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="50px" y="70px" fill="#f30101" data-wg-x="50" data-wg-y="70" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="50px" y="80px" fill="#f30101" data-wg-x="50" data-wg-y="80" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="50px" y="90px" fill="#f30101" data-wg-x="50" data-wg-y="90" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="60px" y="50px" fill="#f30101" data-wg-x="60" data-wg-y="50" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="60px" y="60px" fill="#f30101" data-wg-x="60" data-wg-y="60" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="60px" y="70px" fill="#f30101" data-wg-x="60" data-wg-y="70" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="60px" y="80px" fill="#f30101" data-wg-x="60" data-wg-y="80" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="60px" y="90px" fill="#f30101" data-wg-x="60" data-wg-y="90" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="70px" y="50px" fill="#f30101" data-wg-x="70" data-wg-y="50" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="70px" y="60px" fill="#f30101" data-wg-x="70" data-wg-y="60" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="70px" y="70px" fill="#f30101" data-wg-x="70" data-wg-y="70" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="70px" y="80px" fill="#f30101" data-wg-x="70" data-wg-y="80" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="70px" y="90px" fill="#f30101" data-wg-x="70" data-wg-y="90" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="80px" y="50px" fill="#f30101" data-wg-x="80" data-wg-y="50" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="80px" y="60px" fill="#f30101" data-wg-x="80" data-wg-y="60" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="80px" y="70px" fill="#f30101" data-wg-x="80" data-wg-y="70" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="80px" y="80px" fill="#f30101" data-wg-x="80" data-wg-y="80" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="80px" y="90px" fill="#f30101" data-wg-x="80" data-wg-y="90" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="90px" y="80px" fill="#f30101" data-wg-x="90" data-wg-y="80" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="90px" y="90px" fill="#f30101" data-wg-x="90" data-wg-y="90" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="100px" y="80px" fill="#f30101" data-wg-x="100" data-wg-y="80" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="100px" y="90px" fill="#f30101" data-wg-x="100" data-wg-y="90" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="110px" y="80px" fill="#f30101" data-wg-x="110" data-wg-y="80" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="110px" y="90px" fill="#f30101" data-wg-x="110" data-wg-y="90" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="100px" y="50px" fill="#f30101" data-wg-x="100" data-wg-y="50" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="100px" y="60px" fill="#f30101" data-wg-x="100" data-wg-y="60" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="110px" y="50px" fill="#f30101" data-wg-x="110" data-wg-y="50" data-wg-type="room"></rect>
<rect width="10px" height="10px" x="110px" y="60px" fill="#f30101" data-wg-x="110" data-wg-y="60" data-wg-type="room"></rect>
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