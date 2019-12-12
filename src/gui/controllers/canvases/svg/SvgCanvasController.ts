import { FileFormat } from '../../../../WorldGenerator';
import { defaultWorldItemDefinitions } from '../../../configs/defaultWorldItemDefinitions';
import { ControllerFacade } from '../../ControllerFacade';
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
import { GameObjectTemplate } from '../../../../model/types/GameObjectTemplate';
import { SelectTool } from './tools/SelectTool';
import { CanvasItemSettingsForm } from '../../forms/CanvasItemSettingsForm';

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
        <wg-type is-border="false" scale="1" translate-y="0" type-name="building" shape="polygon"></wg-type>
        <wg-type is-border="false" scale="1" translate-y="0" type-name="model" shape="polygon"></wg-type>
    </metadata>
    <rect width="100px" height="50px" x="50px" y="30px" fill="#7B7982" data-wg-x="50" data-wg-y="30" data-wg-width="100" data-wg-height="50" data-wg-type="building"></rect>
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
    worldItemDefinitions: GameObjectTemplate[];
    selectedWorldItemDefinition: GameObjectTemplate;

    canvasItemSettingsForm: CanvasItemSettingsForm;

    private renderCanvasFunc = () => null;
    private renderToolbarFunc = () => null;
    private renderSettingsFunc = () => null;
    
    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
        this.worldItemDefinitions = [...defaultWorldItemDefinitions];
        this.selectedWorldItemDefinition = this.worldItemDefinitions[0];

        this.selectionModel = new SelectionModel();
        this.configModel = new SvgConfig();
        this.pixelModel = new PixelModel(this.configModel);
        
        this.mouseController = new MouseHandler(this);
        this.writer = new SvgCanvasWriter(this, controllers.eventDispatcher);
        this.reader = new SvgCanvasReader(this);

        this.tools = [
            new RectangleTool(this, this.controllers.eventDispatcher),
            new DeleteTool(this),
            new SelectTool(this)
        ];

        this.activeTool = this.tools[0];
        this.writer.write(initialSvg, FileFormat.SVG);

        this.canvasItemSettingsForm = new CanvasItemSettingsForm(this, this.controllers.eventDispatcher);
    }

    renderCanvas() {
        this.renderCanvasFunc();
    }

    renderToolbar() {
        this.renderToolbarFunc();
    }

    renderSettings() {
        this.renderSettingsFunc();
    }

    setActiveTool(toolType: ToolType) {
        this.activeTool = this.tools.find(tool => tool.type === toolType);
        this.activeTool.activate();
        this.renderToolbar();
    }

    getId() {
        return SvgCanvasController.id;
    }

    resize(): void {};

    setCanvasRenderer(renderFunc: () => void) {
        this.renderCanvasFunc = renderFunc;
    }

    setToolbarRenderer(renderFunc: () => void) {
        this.renderToolbarFunc = renderFunc;
    }

    setSettingsRenderer(renderFunc: () => void) {
        this.renderSettingsFunc = renderFunc;
    }

    activate(): void {
        // this.
    }

    setSelectedWorldItemDefinition(worldItemDefinition: GameObjectTemplate) {
        this.selectedWorldItemDefinition = worldItemDefinition;
        this.renderToolbar();
    }
}