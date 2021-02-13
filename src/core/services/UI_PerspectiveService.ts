import Split from 'split.js';
import { SceneEditorPanelId } from '../../modules/scene_editor/main/SceneEditorModule';
import { NodeEditorPanelId } from '../../modules/graph_editor/NodeEditorModule';
import { NodeListPanelId } from '../../modules/graph_editor/contribs/side_panel/node_library/NodeLibraryModule';
import { ObjectPropertiesPanelId } from '../../modules/sketch_editor/contribs/side_panel/obj_properties/ObjPropertiesModule';
import { SketchEditorPanelId } from '../../modules/sketch_editor/main/SketchEditorModule';
import { FileSettingsPanelId } from '../../modules/contribs/side_panel/file_settings/FileSettingsModule';
import { LayoutSettingsPanelId } from '../../modules/contribs/side_panel/layout_settings/LayoutSettingsModule';
import { UI_Region } from '../models/UI_Panel';
import { Registry } from '../Registry';
import { timeStamp } from 'console';


export class LayoutHandler {
    private registry: Registry;

    private panelIds = [UI_Region.Sidepanel, UI_Region.Canvas1, UI_Region.Canvas2];
    private split: any;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    buildLayout() {
        if (!this.registry.ui.helper.getPanel1()) {
            this.panelIds = [UI_Region.Sidepanel, UI_Region.Canvas2];
        } else {
            this.panelIds = [UI_Region.Sidepanel, UI_Region.Canvas1, UI_Region.Canvas2];
        }

        if (this.split) {
            this.split.destroy();
        }

        let panelIds = this.panelIds;
        let sizes: number[] = [];

        if (this.panelIds.length === 2) {
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
        this.registry.ui.helper.getPanel1() && this.registry.ui.helper.getPanel1().resize();
        this.registry.ui.helper.getPanel2() && this.registry.ui.helper.getPanel2().resize();
    }

    setSizesInPercent(sizes: number[]) {

        const [sidepanelWidth] = sizes;

        if (this.panelIds.length === 2) {
            const prevSidepanelWidth = this.registry.preferences.panelSizes.Sidepanel.twoColumnRatio;
            const prevCanvasWidth = this.registry.preferences.panelSizes[UI_Region.Canvas2].twoColumnRatio;

            const canvasWidth = prevCanvasWidth - (sidepanelWidth - prevSidepanelWidth);

            const widths: number[] = [sidepanelWidth, canvasWidth]

            // make sure added sizes don't diverge from 100% in the long term
            let sum = widths.reduce((sum, currSize) => sum + currSize, 0);
            if (sum < 100) {
                widths[0] += 100 - sum;
            }

            this.registry.preferences.panelSizes.Sidepanel.twoColumnRatio = widths[0];
            this.registry.preferences.panelSizes[UI_Region.Canvas2].twoColumnRatio = widths[1];


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
export const NodeEditorPerspectiveName = 'Node Editor';

export class UI_PerspectiveService {

    perspectives: UI_Perspective[] = [];
    activePerspective: UI_Perspective;
    isDirty = true;

    layoutHandler: LayoutHandler;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.layoutHandler = new LayoutHandler(registry);

        this.perspectives.push({
            name: SceneEditorPerspectiveName,
            canvas1Plugin: undefined,
            canvas2Plugin: SceneEditorPanelId,
            sidepanelPlugins: [
                FileSettingsPanelId,
                LayoutSettingsPanelId,
                ObjectPropertiesPanelId,
            ]
        });

        this.perspectives.push({
            name: NodeEditorPerspectiveName,
            canvas1Plugin: NodeEditorPanelId,
            canvas2Plugin: SceneEditorPanelId,
            sidepanelPlugins: [
                FileSettingsPanelId,
                LayoutSettingsPanelId,
                NodeListPanelId
            ]
        });
    }

    getActiveRegions() {
        if (this.activePerspective.canvas1Plugin) {
            return [UI_Region.Sidepanel, UI_Region.Canvas1, UI_Region.Canvas2];
        } else {
            return [UI_Region.Sidepanel, UI_Region.Canvas2];
        }
    }

    activatePerspective(name: string) {
        this.isDirty = true;
        const perspective = this.perspectives.find(perspective => perspective.name === name);
        this.activePerspective = perspective;

        const panel1 = this.registry.services.module.ui.getCanvas(perspective.canvas1Plugin);
        const panel2 = this.registry.services.module.ui.getCanvas(perspective.canvas2Plugin);
        const sidepanels = perspective.sidepanelPlugins.map(panelId => this.registry.services.module.ui.getPanel(panelId))

        this.registry.ui.helper.setPanel1(panel1);
        this.registry.ui.helper.setPanel2(panel2);
        this.registry.ui.helper.setSidebarPanels(sidepanels);
    }
}
