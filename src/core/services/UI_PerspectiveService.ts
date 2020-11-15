import Split from 'split.js';
import { GameViewerPanelId } from '../../plugins/canvas_plugins/game_viewer/registerGameViewer';
import { NodeEditorPanelId } from '../../plugins/canvas_plugins/node_editor/registerNodeEditor';
import { NodeListPanelId } from '../../plugins/canvas_plugins/node_editor/registerNodeListPanel';
import { ObjectSettingsPanelId } from '../../plugins/canvas_plugins/scene_editor/registerObjectSettingsPanel';
import { SceneEditorPanelId } from '../../plugins/canvas_plugins/scene_editor/registerSceneEditor';
import { FileSettingsPanelId } from '../../plugins/sidepanel_plugins/file_settings/registerFileSettingsPanel';
import { LayoutSettingsPanelId } from '../../plugins/sidepanel_plugins/layout_settings/registerLayoutSettingsPanel';
import { UI_Region } from '../plugin/UI_Panel';
import { Registry } from '../Registry';


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

        this.split = Split(panelIds.map(id => `#${id.toLowerCase()}`),
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
        this.registry.ui.helper.getPanel1().resize();
        this.registry.ui.helper.getPanel2().resize();
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
            canvas1Plugin: SceneEditorPanelId,
            canvas2Plugin: GameViewerPanelId,
            sidepanelPlugins: [
                FileSettingsPanelId,
                LayoutSettingsPanelId,
                ObjectSettingsPanelId,
            ]
        });

        this.perspectives.push({
            name: 'Node Editor',
            canvas1Plugin: NodeEditorPanelId,
            canvas2Plugin: GameViewerPanelId,
            sidepanelPlugins: [
                FileSettingsPanelId,
                LayoutSettingsPanelId,
                NodeListPanelId
            ]
        });
    }

    activatePerspective(name: string) {
        const perspective = this.perspectives.find(perspective => perspective.name === name);
        this.activePerspective = perspective;

        const panel1 = this.registry.ui.canvas.getCanvas(perspective.canvas1Plugin);
        const panel2 = this.registry.ui.canvas.getCanvas(perspective.canvas2Plugin);
        const sidepanels = perspective.sidepanelPlugins.map(panelId => this.registry.ui.panel.getPanel(panelId))

        this.registry.ui.helper.setPanel1(panel1);
        this.registry.ui.helper.setPanel2(panel2);
        this.registry.ui.helper.setSidebarPanels(sidepanels);
    }
}
