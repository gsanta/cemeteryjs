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
        <wg-type color="#7B7982" is-border="true" scale="1" translate-y="0" type-name="wall"></wg-type>
        <wg-type color="#BFA85C" is-border="true" scale="3" translate-y="-4" type-name="door"></wg-type>
        <wg-type is-border="false" scale="0.5" translate-y="0" type-name="table"></wg-type>
        <wg-type color="#70C0CF" is-border="true" scale="3" translate-y="0" type-name="window"></wg-type>
        <wg-type color="#9894eb" is-border="false" scale="3" translate-y="0" type-name="chair"></wg-type>
        <wg-type color="#8c7f6f" is-border="false" scale="3.3" translate-y="1" type-name="shelves"></wg-type>
        <wg-type color="#66553f" is-border="false" scale="3" translate-y="2" type-name="stairs"></wg-type>
        <wg-type is-border="false" scale="1" translate-y="0" type-name="outdoors"></wg-type>
        <wg-type is-border="false" scale="1" translate-y="0" type-name="room"></wg-type>
        <wg-type is-border="false" scale="1" translate-y="0" type-name="player"></wg-type>
    </metadata>
    <rect width="10px" height="10px" x="120px" y="60px" fill="#7B7982" data-wg-x="120" data-wg-y="60" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="130px" y="60px" fill="#7B7982" data-wg-x="130" data-wg-y="60" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="140px" y="60px" fill="#7B7982" data-wg-x="140" data-wg-y="60" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="150px" y="60px" fill="#7B7982" data-wg-x="150" data-wg-y="60" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="160px" y="60px" fill="#7B7982" data-wg-x="160" data-wg-y="60" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="170px" y="60px" fill="#7B7982" data-wg-x="170" data-wg-y="60" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="180px" y="60px" fill="#7B7982" data-wg-x="180" data-wg-y="60" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="180px" y="70px" fill="#7B7982" data-wg-x="180" data-wg-y="70" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="180px" y="80px" fill="#7B7982" data-wg-x="180" data-wg-y="80" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="180px" y="90px" fill="#7B7982" data-wg-x="180" data-wg-y="90" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="180px" y="100px" fill="#7B7982" data-wg-x="180" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="170px" y="100px" fill="#7B7982" data-wg-x="170" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="160px" y="100px" fill="#7B7982" data-wg-x="160" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="150px" y="100px" fill="#7B7982" data-wg-x="150" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="140px" y="100px" fill="#7B7982" data-wg-x="140" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="130px" y="100px" fill="#7B7982" data-wg-x="130" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="120px" y="100px" fill="#7B7982" data-wg-x="120" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="110px" y="100px" fill="#7B7982" data-wg-x="110" data-wg-y="100" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="110px" y="90px" fill="#7B7982" data-wg-x="110" data-wg-y="90" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="110px" y="80px" fill="#7B7982" data-wg-x="110" data-wg-y="80" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="110px" y="70px" fill="#7B7982" data-wg-x="110" data-wg-y="70" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="110px" y="60px" fill="#7B7982" data-wg-x="110" data-wg-y="60" data-wg-type="wall"></rect>
    <rect width="10px" height="10px" x="120px" y="70px" data-wg-x="120" data-wg-y="70" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="120px" y="80px" data-wg-x="120" data-wg-y="80" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="120px" y="90px" data-wg-x="120" data-wg-y="90" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="130px" y="70px" data-wg-x="130" data-wg-y="70" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="130px" y="80px" data-wg-x="130" data-wg-y="80" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="130px" y="90px" data-wg-x="130" data-wg-y="90" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="140px" y="70px" data-wg-x="140" data-wg-y="70" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="140px" y="80px" data-wg-x="140" data-wg-y="80" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="140px" y="90px" data-wg-x="140" data-wg-y="90" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="150px" y="70px" data-wg-x="150" data-wg-y="70" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="150px" y="80px" data-wg-x="150" data-wg-y="80" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="150px" y="90px" data-wg-x="150" data-wg-y="90" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="160px" y="70px" data-wg-x="160" data-wg-y="70" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="160px" y="80px" data-wg-x="160" data-wg-y="80" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="160px" y="90px" data-wg-x="160" data-wg-y="90" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="170px" y="70px" data-wg-x="170" data-wg-y="70" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="170px" y="80px" data-wg-x="170" data-wg-y="80" data-wg-type="room"></rect>
    <rect width="10px" height="10px" x="170px" y="90px" data-wg-x="170" data-wg-y="90" data-wg-type="room"></rect>
</svg>
`;

export class SvgCanvasController implements IEditableCanvas {
    static id = 'bitmap-editor';
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
    
    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
        this.worldItemDefinitionModel = new WorldItemDefinitionModel(defaultWorldItemDefinitions);
        this.WorldItemDefinitionForm = new WorldItemDefinitionForm(this);

        this.selectionModel = new SelectionModel();
        this.configModel = new SvgConfig();
        this.pixelModel = new PixelModel(this.configModel);
        
        this.mouseController = new MouseHandler(this);
        this.writer = new SvgCanvasWriter(this);
        this.reader = new SvgCanvasReader(this);

        this.tools = [
            new RectangleTool(this),
            new DeleteTool(this)
        ];

        this.activeTool = this.tools[0];
    }

    updateUI() {
        this.controllers.updateUIController.updateUI();
    }

    setRendererDirty() {
        this.controllers.webglEditorController.isDirty = true;
    }

    setActiveTool(toolType: ToolType) {
        this.activeTool = this.tools.find(tool => tool.type === toolType);
        this.updateUI();
    }

    getId() {
        return SvgCanvasController.id;
    }

    resize(): void {};

    setRenderer(renderFunc: () => void) {}
    render() {}

    activate(): void {
        // this.
    }
}