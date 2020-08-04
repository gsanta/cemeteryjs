import { SceneEditorPluginId } from '../../plugins/scene_editor/SceneEditorPlugin';
import { GameViewerPluginId } from '../../plugins/game_viewer/GameViewerPlugin';
import { ObjectSettingsPluginId } from '../../plugins/object_settings/ObjectSettingsPlugin';
import { NodeEditorPluginId } from '../../plugins/node_editor/NodeEditorPlugin';
import { NodeEditorSettingsPluginId } from '../../plugins/node_editor/NodeEditorSettingsPlugin';
import { CodeEditorPluginId } from '../../plugins/code_editor/CodeEditorPlugin';
import { LevelSettingsPluginId } from '../../plugins/level_settings/LevelSettingsPlugin';
import { Registry } from '../Registry';
import Split from 'split.js';
import { UI_Region } from '../UI_Plugin';
import { AbstractPlugin } from '../AbstractPlugin';

export class LayoutHandler {
    private registry: Registry;

    private panelIds = ['sidepanel', 'canvas1', 'canvas2'];

    constructor(registry: Registry) {
        this.registry = registry;
    }

    buildLayout() {
        let panelIds = this.panelIds;

        if (this.registry.preferences.fullscreenRegion) {
            panelIds = ['sidepanel', this.registry.preferences.fullscreenRegion]
        }

        let sizes = panelIds.map(panelId => this.registry.preferences.panelSizes[panelId as 'sidepanel' | 'canvas1' | 'canvas2'].currRatio);
        let minSize = panelIds.map(panelId => this.registry.preferences.panelSizes[panelId as 'sidepanel' | 'canvas1' | 'canvas2'].minPixel);

        Split(panelIds.map(id => `#${id}`),
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
                onDragEnd: ((sizes) => this.registry.services.layout.setSizesInPercent(sizes)) as any
            }
        );
    }

    private resizePlugins() {
        if (this.registry.preferences.fullscreenRegion) {
            (this.registry.plugins.getByRegion(this.registry.preferences.fullscreenRegion)[0] as AbstractPlugin).resize()
        } else {
            (this.registry.plugins.getByRegion(UI_Region.Canvas1)[0] as AbstractPlugin).resize();
            (this.registry.plugins.getByRegion(UI_Region.Canvas2)[0] as AbstractPlugin).resize();
        }
    }

    // setSizesInPercent(sizes: number[]) {
    //     const [sidepanelWidth, ...rest] = sizes;

    //     if (sizes.length === 2) {
    //         this.singleLayoutSizes = [...sizes];

    //         let [currentSidepanelWidth, panel1, panel2] = this.doubleLayoutSizes;
    //         panel1 = panel1 - (sidepanelWidth - currentSidepanelWidth) / 2;
    //         panel2 = panel2 - (sidepanelWidth - currentSidepanelWidth) / 2;
    //         this.doubleLayoutSizes = [sidepanelWidth, panel1, panel2];
    //     } else {
    //         this.doubleLayoutSizes = [...sizes];

    //         let [currentSidepanelWidth, panel1] = this.singleLayoutSizes;
    //         this.singleLayoutSizes = [sidepanelWidth, panel1 - (sidepanelWidth - currentSidepanelWidth)];
    //     }

    //     // make sure added sizes don't diverge from 100% in the long term
    //     let sum = this.doubleLayoutSizes.reduce((sum, currSize) => sum + currSize, 0);
    //     if (sum < 100) {
    //         this.doubleLayoutSizes[0] += 100 - sum;
    //     }
    //     sum = this.singleLayoutSizes.reduce((sum, currSize) => sum + currSize, 0);
    //     if (sum < 100) {
    //         this.singleLayoutSizes[0] += 100 - sum;
    //     }
    // }
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

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

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
        this.deactivatePerspective(this.activePerspective);

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
