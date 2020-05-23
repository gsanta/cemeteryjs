import { Point } from '../../core/geometry/shapes/Point';
import { Registry } from '../../core/Registry';
import { UpdateTask } from '../../core/services/UpdateServices';
import { calcOffsetFromDom, AbstractPlugin } from '../../core/AbstractPlugin';
import { Camera2D } from '../common/camera/Camera2D';
import { ActionEditorSettings } from './settings/ActionEditorSettings';
import { NodeStore } from '../../core/stores/NodeStore';
import { NodePreset, NodePresetRecipe } from '../../core/models/nodes/NodePreset';
import { NodeType, NodeModel } from '../../core/models/views/nodes/NodeModel';
import { AndNode } from '../../core/models/views/nodes/AndNode';
import { AnimationNode } from '../../core/models/views/nodes/AnimationNode';
import { KeyboardNode } from '../../core/models/views/nodes/KeyboardNode';
import { MeshNode } from '../../core/models/views/nodes/MeshNode';
import { MoveNode } from '../../core/models/views/nodes/MoveNode';
import { TurnNode } from '../../core/models/views/nodes/TurnNode';
import { SplitNode } from '../../core/models/views/nodes/SplitNode';

function getScreenSize(canvasId: string): Point {
    if (typeof document !== 'undefined') {
        const svg: HTMLElement = document.getElementById(canvasId);

        if (svg) {
            const rect: ClientRect = svg.getBoundingClientRect();
            return new Point(rect.width, rect.height);
        }
    }
    return undefined;
}

function cameraInitializer(canvasId: string, registry: Registry) {
    const screenSize = getScreenSize(canvasId);
    if (screenSize) {
        return new Camera2D(registry, new Point(screenSize.x, screenSize.y));
    } else {
        return new Camera2D(registry, new Point(100, 100));
    }
}

export enum CanvasTag {
    Selected = 'selected',
    Hovered = 'hovered'
}

const recipes: NodePresetRecipe[] = [
    {
        presetName: 'Mesh navigation',
        nodes: [
            {
                type: NodeType.Mesh,
                relativeCoord: new Point(-400, -100)
            },
            {
                type: NodeType.Split,
                relativeCoord: new Point(-200, -100)
            },
            {
                type: NodeType.Keyboard,
                relativeCoord: new Point(-300, 100)
            },
            {
                type: NodeType.Keyboard,
                relativeCoord: new Point(-300, 300)
            },
        ]
    }
]

export class ActionEditorPlugin extends AbstractPlugin {
    static id = 'action-editor-plugin';
    
    visible = true;
    
    private camera: Camera2D;

    actionSettings: ActionEditorSettings;
    presets: NodePreset[];

    constructor(registry: Registry) {
        super(registry);

        this.camera = cameraInitializer(ActionEditorPlugin.id, registry);

        this.selectedTool = this.registry.tools.pan;
        this.actionSettings = new ActionEditorSettings(registry);
        this.presets = [
            new NodePreset(this.registry, recipes[0])
        ];

        const templates: NodeModel[] = [
            new AndNode(undefined),
            new AnimationNode(undefined),
            new KeyboardNode(undefined),
            new MeshNode(undefined),
            new MoveNode(undefined),
            new SplitNode(undefined),
            new TurnNode(undefined)
        ];

        templates.forEach(template => this.registerTemplate(template));

        const presets: NodePreset[] = [
            new NodePreset(this.registry, recipes[0])
        ];

        presets.forEach(preset => this.registerPreset(preset));

        this.registry.stores.nodeStore.presets
    }

    getStore(): NodeStore {
        return this.registry.stores.nodeStore;
    }

    getId() {
        return ActionEditorPlugin.id;
    }

    resize(): void {
        this.camera.resize(getScreenSize(ActionEditorPlugin.id));
        this.registry.tools.zoom.resize();
        this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas);
    };

    isVisible(): boolean {
        return this.visible;
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }

    getOffset() {
        return calcOffsetFromDom(this.getId());
    }

    getCamera() {
        return this.camera;
    }

    registerTemplate(node: NodeModel) {
        if (this.registry.stores.nodeStore.templates.find(n => n.type === node.type)) {
            throw new Error(`Node template with type ${node.type} already registered`);
        }
        this.registry.stores.nodeStore.templates.push(node);
    }

    registerPreset(preset: NodePreset) {
        if (this.registry.stores.nodeStore.templates.find(n => n.type === preset.presetName)) {
            throw new Error(`Node preset with name ${preset.presetName} already registered`);
        }
        this.registry.stores.nodeStore.presets.push(preset);
    }

    updateCamera() {
        this.camera = cameraInitializer(ActionEditorPlugin.id, this.registry);
        this.registry.services.update.runImmediately(UpdateTask.RepaintCanvas);
    }
}