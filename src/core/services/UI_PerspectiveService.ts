import { SceneEditorPluginId } from '../../plugins/scene_editor/SceneEditorPlugin';
import { GameViewerPluginId } from '../../plugins/game_viewer/GameViewerPlugin';
import { ObjectSettingsPluginId } from '../../plugins/object_settings/ObjectSettingsPlugin';
import { NodeEditorPluginId } from '../../plugins/node_editor/NodeEditorPlugin';
import { NodeEditorSettingsPluginId } from '../../plugins/node_editor/NodeEditorSettingsPlugin';
import { CodeEditorPluginId } from '../../plugins/code_editor/CodeEditorPlugin';
import { LevelSettingsPluginId } from '../../plugins/level_settings/LevelSettingsPlugin';
import { Registry } from '../Registry';

export interface UI_Perspective {
    name: string;

    sidepanelPlugins?: string[];
    canvas1Plugin: string;
    canvas2Plugin?: string;
}

export class UI_PerspectiveService {

    perspectives: UI_Perspective[] = [];
    activePerspective: UI_Perspective;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.perspectives.push({
            name: 'Scene Editor',
            canvas1Plugin: SceneEditorPluginId,
            canvas2Plugin: GameViewerPluginId,
            sidepanelPlugins: [
                ObjectSettingsPluginId
            ]
        });

        this.perspectives.push({
            name: 'Scene Editor',
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
}
