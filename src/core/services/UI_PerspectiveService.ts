import { SceneEditorPluginId } from '../../plugins/ui_plugins/scene_editor/SceneEditorPlugin';
import { GameViewerPluginId } from '../../plugins/ui_plugins/game_viewer/GameViewerPlugin';
import { ObjectSettingsPluginId } from '../../plugins/ui_plugins/scene_editor/ObjectSettingsPlugin';
import { NodeEditorPluginId } from '../../plugins/ui_plugins/node_editor/NodeEditorPlugin';
import { NodeEditorSettingsPluginId } from '../../plugins/ui_plugins/node_editor/NodeEditorSettingsPlugin';
import { CodeEditorPluginId } from '../../plugins/ui_plugins/code_editor/CodeEditorPlugin';
import { Registry } from '../Registry';
import Split from 'split.js';
import { UI_Region } from '../plugins/UI_Plugin';
import { AbstractCanvasPlugin } from '../plugins/AbstractCanvasPlugin';
import { LevelSettingsPluginId } from '../../plugins/ui_plugins/sidepanel/LevelSettingsPlugin';


export class LayoutHandler {
    private registry: Registry;

    private panelIds = [UI_Region.Sidepanel, UI_Region.Canvas1, UI_Region.Canvas2];
    private split: any;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    buildLayout() {
        if (this.split) {
            this.split.destroy();
        }

        let panelIds = this.panelIds;
        let sizes: number[] = [];

        if (this.registry.preferences.fullscreenRegion) {
            panelIds = [UI_Region.Sidepanel, this.registry.preferences.fullscreenRegion];
            sizes = panelIds.map(panelId => this.registry.preferences.panelSizes[panelId as 'Sidepanel' | 'Canvas1' | 'Canvas2'].twoColumnRatio);
        } else {
            sizes = panelIds.map(panelId => this.registry.preferences.panelSizes[panelId as 'Sidepanel' | 'Canvas1' | 'Canvas2'].threeColumnRatio);
        }

        let minSize = panelIds.map(panelId => this.registry.preferences.panelSizes[panelId as 'Sidepanel' | 'Canvas1' | 'Canvas2'].minPixel);

        this.split = Split(panelIds.map(id => `#${id}`),
            {
                sizes: sizes,
                minSize: minSize,
                elementStyle: (dimension, size, gutterSize) => ({
                    'flex-basis': `calc(${size}% - ${gutterSize}px)`,
                }),
                gutterStyle: (dimension, gutterSize) => ({
                    'width': '2px',
                    'cursor': 'ew-resize'
                }),
                onDrag: () => this.resizePlugins(),
                onDragEnd: ((sizes) => this.setSizesInPercent(sizes)) as any
            }
        );
    }

    resizePlugins() {
        if (this.registry.preferences.fullscreenRegion) {
            (this.registry.plugins.getByRegion(this.registry.preferences.fullscreenRegion)[0] as AbstractCanvasPlugin).resize()
        } else {
            (this.registry.plugins.getByRegion(UI_Region.Canvas1)[0] as AbstractCanvasPlugin).resize();
            (this.registry.plugins.getByRegion(UI_Region.Canvas2)[0] as AbstractCanvasPlugin).resize();
        }
    }

    setSizesInPercent(sizes: number[]) {

        const [sidepanelWidth] = sizes;

        if (this.registry.preferences.fullscreenRegion) {
            const prevSidepanelWidth = this.registry.preferences.panelSizes.Sidepanel.twoColumnRatio;
            const prevCanvasWidth = this.registry.preferences.panelSizes[this.registry.preferences.fullscreenRegion].twoColumnRatio;

            const canvasWidth = prevCanvasWidth - (sidepanelWidth - prevSidepanelWidth);

            const widths: number[] = [sidepanelWidth, canvasWidth]

            // make sure added sizes don't diverge from 100% in the long term
            let sum = widths.reduce((sum, currSize) => sum + currSize, 0);
            if (sum < 100) {
                widths[0] += 100 - sum;
            }

            this.registry.preferences.panelSizes.Sidepanel.twoColumnRatio = widths[0];
            this.registry.preferences.panelSizes[this.registry.preferences.fullscreenRegion].twoColumnRatio = widths[1];


        } else {
            const prevSidepanelWidth = this.registry.preferences.panelSizes.Sidepanel.twoColumnRatio;
            const prevCanvas1Width = this.registry.preferences.panelSizes.Canvas1.twoColumnRatio;
            const prevCanvas2Width = this.registry.preferences.panelSizes.Canvas2.twoColumnRatio;

            const canvas1Width = prevCanvas1Width - (sidepanelWidth - prevSidepanelWidth) / 2;
            const canvas2Width = prevCanvas2Width - (sidepanelWidth - prevSidepanelWidth) / 2;

            const widths: number[] = [sidepanelWidth, canvas1Width, canvas2Width];

            // make sure added sizes don't diverge from 100% in the long term
            let sum = widths.reduce((sum, currSize) => sum + currSize, 0);
            if (sum < 100) {
                widths[0] += 100 - sum;
            }

            this.registry.preferences.panelSizes.Sidepanel.threeColumnRatio = widths[0];
            this.registry.preferences.panelSizes[UI_Region.Canvas1 as string as 'sidepanel' | 'canvas1' | 'canvas2'].threeColumnRatio = widths[1];
            this.registry.preferences.panelSizes[UI_Region.Canvas2 as string as 'sidepanel' | 'canvas1' | 'canvas2'].threeColumnRatio = widths[2];
        }
    }
}

export interface UI_Perspective {
    name: string;

    sidepanelPlugins?: string[];
    canvas1Plugin: string;
    canvas2Plugin?: string;
}

export const SceneEditorPerspectiveName = 'Scene Editor';

export class UI_PerspectiveService {

    perspectives: UI_Perspective[] = [];
    activePerspective: UI_Perspective;

    layoutHandler: LayoutHandler;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.layoutHandler = new LayoutHandler(registry);

        this.perspectives.push({
            name: SceneEditorPerspectiveName,
            canvas1Plugin: SceneEditorPluginId,
            canvas2Plugin: GameViewerPluginId,
            sidepanelPlugins: [
                ObjectSettingsPluginId
            ]
        });

        this.perspectives.push({
            name: 'Node Editor',
            canvas1Plugin: NodeEditorPluginId,
            canvas2Plugin: GameViewerPluginId,
            sidepanelPlugins: [
                LevelSettingsPluginId,
                NodeEditorSettingsPluginId
            ]
        });

        this.perspectives.push({
            name: 'Code Editor',
            canvas1Plugin: CodeEditorPluginId,
            canvas2Plugin: GameViewerPluginId
        });
    }

    activatePerspective(name: string) {
        this.activePerspective && this.deactivatePerspective(this.activePerspective);

        const perspective = this.perspectives.find(perspective => perspective.name === name);
        this.activePerspective = perspective;

        this._activatePerspective(this.activePerspective);
    }

    private deactivatePerspective(perspective: UI_Perspective) {
        this.registry.plugins.deactivatePlugin(perspective.canvas1Plugin);
        
        if (perspective.canvas2Plugin) {
            this.registry.plugins.deactivatePlugin(perspective.canvas2Plugin);
        }

        (perspective.sidepanelPlugins || []).forEach(plugin => this.registry.plugins.deactivatePlugin(plugin))
    }

    private _activatePerspective(perspective: UI_Perspective) {
        this.registry.plugins.activatePlugin(perspective.canvas1Plugin);
        
        if (perspective.canvas2Plugin) {
            this.registry.plugins.activatePlugin(perspective.canvas2Plugin);
        }

        (perspective.sidepanelPlugins || []).forEach(plugin => this.registry.plugins.activatePlugin(plugin))
    }
}
