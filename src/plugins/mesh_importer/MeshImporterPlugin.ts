import { AbstractPlugin, calcOffsetFromDom } from '../../core/AbstractPlugin';
import { NodeType } from '../../core/models/nodes/NodeModel';
import { Registry } from '../../core/Registry';
import { LayoutType } from '../../core/services/PluginService';
import { Camera3D } from '../common/camera/Camera3D';
import { ICamera } from '../common/camera/ICamera';
import { Tool, ToolType } from '../common/tools/Tool';
import { toolFactory } from '../common/toolbar/toolFactory';
import { Tools } from '../Tools';
import { ImportSettings } from '../scene_editor/settings/ImportSettings';
import { PluginServices } from '../common/PluginServices';
(<any> window).earcut = require('earcut');

export function getCanvasElement(viewId: string): HTMLCanvasElement {
    if (typeof document !== 'undefined') {
        const canvas: HTMLCanvasElement = document.querySelector(`#${viewId} canvas`);
        return canvas;
    }
}

export class MeshImporterPlugin extends AbstractPlugin {
    static id = 'mesh-importer-plugin';
    visible = true;
    allowedLayouts = new Set([LayoutType.Dialog]);

    importSettings: ImportSettings;
    pluginServices: PluginServices<this>;

    private camera: Camera3D;

    constructor(registry: Registry) {
        super(registry);

        const tools = [ToolType.Camera].map(toolType => toolFactory(toolType, this, registry));
        this.tools = new Tools(tools);

        this.selectedTool = this.tools.byType(ToolType.Camera);

        this.importSettings = new ImportSettings(registry);
        // this.pluginServices = new PluginServices(
        //     new ThumbnailMakerService()
        // )
    }

    getStore() {
        return null;
    }

    getCamera(): ICamera {
        return this.camera;
    }

    resize() {
        if (this.registry.services.game && this.registry.services.game.gameEngine) {
            this.registry.services.game.gameEngine.engine.resize();
        }
    }

    setup() {
        this.registry.services.game.init(getCanvasElement(this.getId()));
        
        this.camera = new Camera3D(this.registry, this.registry.services.game.getEngine(), this.registry.services.game.getScene());

        this.registry.services.game.importAllConcepts();

        this.registry.services.node.getNodesByType(NodeType.Route).forEach(node => this.registry.services.node.getHandler(node).wake(node));
        this.renderFunc && this.renderFunc();
    }


    destroy() {
        this.registry.services.game.destroy();
    }

    getId(): string {
        return MeshImporterPlugin.id;
    }

    getSelectedTool(): Tool {
        return this.selectedTool;
    }

    isVisible(): boolean {
        return this.visible;
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }    

    getOffset() {
        return calcOffsetFromDom(this.getId());
    }
}