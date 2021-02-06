import { EngineHooks } from '../engine/hooks/EngineHooks';
import { Registry } from '../Registry';
import { UI_Panel, UI_Region } from './UI_Panel';

export class Plugins {
    engineHooks: EngineHooks;

    private activePanels: UI_Panel[] = [];

    private panels: Map<string, UI_Panel> = new Map();

    visibilityDirty = true;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
        this.engineHooks = new EngineHooks();
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