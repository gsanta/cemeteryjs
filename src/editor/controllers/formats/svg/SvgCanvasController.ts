import { FileFormat } from '../../../../WorldGenerator';
import { GameObjectTemplate } from '../../../../world_generator/services/GameObjectTemplate';
import { defaultWorldItemDefinitions } from '../../../defaultWorldItemDefinitions';
import { ControllerFacade } from '../../ControllerFacade';
import { CanvasItemSettingsForm } from '../../forms/CanvasItemSettingsForm';
import { ICanvasReader } from '../ICanvasReader';
import { ICanvasWriter } from '../ICanvasWriter';
import { IEditableCanvas } from '../IEditableCanvas';
import { MouseHandler } from './handlers/MouseHandler';
import { Model3DController } from './Model3DController';
import { GridCanvasStore } from './models/GridCanvasStore';
import { SelectionModel } from './models/SelectionModel';
import { SvgConfig } from './models/SvgConfig';
import { SvgCanvasReader } from './SvgCanvasReader';
import { SvgCanvasWriter } from './SvgCanvasWriter';
import { DeleteTool } from './tools/DeleteTool';
import { MoveAndSelectTool } from './tools/MoveAndSelectTool';
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
    tools: Tool[];
    writer: ICanvasWriter;
    reader: ICanvasReader;
    model3dController: Model3DController;

    configModel: SvgConfig;
    pixelModel: GridCanvasStore;
    
    controllers: ControllerFacade;
    worldItemDefinitions: GameObjectTemplate[];
    selectedWorldItemDefinition: GameObjectTemplate;

    canvasItemSettingsForm: CanvasItemSettingsForm;

    selectedTool = ToolType.RECTANGLE;

    private renderCanvasFunc = () => null;
    private renderToolbarFunc = () => null;
    private renderSettingsFunc = () => null;
    
    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
        this.worldItemDefinitions = [...defaultWorldItemDefinitions];
        this.selectedWorldItemDefinition = this.worldItemDefinitions[0];

        this.configModel = new SvgConfig();
        this.pixelModel = new GridCanvasStore(this.configModel);
        
        this.mouseController = new MouseHandler(this);
        this.writer = new SvgCanvasWriter(this, controllers.eventDispatcher);
        this.reader = new SvgCanvasReader(this);
        this.model3dController = new Model3DController(this);

        this.tools = [
            new RectangleTool(this, this.controllers.eventDispatcher),
            new DeleteTool(this, this.controllers.eventDispatcher),
            new MoveAndSelectTool(this, this.controllers.eventDispatcher)
        ];

        this.writer.write(initialSvg);

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
        this.selectedTool = toolType;
        this.renderToolbar();
    }

    getActiveTool(): Tool {
        switch(this.selectedTool) {
            case ToolType.MOVE_AND_SELECT:
                return this.findToolByType(ToolType.MOVE_AND_SELECT);
            case ToolType.DELETE:
                return this.findToolByType(ToolType.DELETE);
            case ToolType.RECTANGLE:
                return this.findToolByType(ToolType.RECTANGLE);
        }
    }

    findToolByType(toolType: ToolType) {
        return this.tools.find(tool => tool.type === toolType);
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