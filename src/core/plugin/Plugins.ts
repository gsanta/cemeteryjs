import { EngineHooks } from '../engine/hooks/EngineHooks';
import { Registry } from '../Registry';
import { AbstractCanvasPanel } from './AbstractCanvasPanel';
import { UI_Panel, UI_Region } from './UI_Panel';
import { UI_PluginFactory } from './UI_PluginFactory';

export class Plugins {
    engineHooks: EngineHooks;

    private activePanels: UI_Panel[] = [];

    private pluginFactories: Map<string, UI_PluginFactory> = new Map();
    private panels: Map<string, UI_Panel> = new Map();

    visibilityDirty = true;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.engineHooks = new EngineHooks();
    }

    private hoveredView: AbstractCanvasPanel;
    
    setHoveredPlugin(view: AbstractCanvasPanel) {
        this.hoveredView = view;
    }

    removeHoveredPlugin(view: AbstractCanvasPanel) {
        if (this.hoveredView === view) {
            this.hoveredView = undefined;
        }
    }

    getHoveredPlugin(): AbstractCanvasPanel {
        return this.hoveredView;
    }

    getActivePlugins(region?: UI_Region): UI_Panel[] {
        if (region) {
            return this.activePanels.filter(activePlugin => activePlugin.region === region);
        }
        return this.activePanels;
    }


    getAll(): UI_Panel[] {
        return Array.from(this.panels.values());
    }
}