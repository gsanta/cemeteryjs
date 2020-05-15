import { AbstractPlugin } from '../AbstractPlugin';
import { Registry } from '../Registry';
import { SceneEditorPlugin } from '../../plugins/scene_editor/SceneEditorPlugin';
import { GameViewerPlugin } from '../../plugins/game_viewer/GameViewerPlugin';
import { ActionEditorPlugin } from '../../plugins/action_editor/ActionEditorPlugin';

export interface LayoutConfig {
    sizes: number[];
    ids: string[];
    minSize: number[];
    name?: string;
}

export enum Layout {
    SceneEditor = 'Scene Editor',
    ActionEditor = 'Action Editor'
}

export class LayoutService {
    private hoveredView: AbstractPlugin;
    private fullScreen: AbstractPlugin;
    visibilityDirty = true;

    activeLayout: LayoutConfig;
    layouts: LayoutConfig[];

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.hoveredView = this.registry.views.sceneEditorView;

        this.layouts = [
            {
                sizes: [12, 44, 44],
                minSize: [230, 300, 300],
                ids: ['toolbar', SceneEditorPlugin.id, GameViewerPlugin.id],
                name: Layout.SceneEditor
            },
            {
                sizes: [12, 88],
                minSize: [230, 500],
                ids: ['toolbar', ActionEditorPlugin.id],
                name: Layout.ActionEditor
            }
        ];

        this.activeLayout = this.layouts[0];
    }
    
    setHoveredView(view: AbstractPlugin) {
        this.hoveredView = view;
    }

    getHoveredView(): AbstractPlugin {
        return this.hoveredView;
    }

    setActiveLayout(layout: LayoutConfig) {
        this.activeLayout = layout;
        this.visibilityDirty = true;
    }

    getActiveViews(): AbstractPlugin[] {
        return this.fullScreen ? [this.fullScreen] : this.registry.views.views.filter(view => this.activeLayout.ids.find(id => view.getId() === id));
    }

    setFullScreen(view: AbstractPlugin) {
        this.visibilityDirty = true;
        this.fullScreen = view;
    }

    getFullScreen(): AbstractPlugin {
        return this.fullScreen;
    }

    getAllViews(): AbstractPlugin[] {
        return this.registry.views.views;
    }

    getViewById<T extends AbstractPlugin = AbstractPlugin>(id: string): T {
        return <T> this.registry.views.views.find(view => view.getId() === id);
    }

    getViewConfigs() {
        const fullScreen = this.getFullScreen();

        if (fullScreen) {
            return {
                sizes: [100],
                ids: [`#${fullScreen.getId()}-split`],
                minSize: []
            }
        } else {
            const viewIds = this.getActiveViews().map(view => `#${view.getId()}-split`);
            
            return {
                sizes: [12, 44, 44],
                minSize: [230, 300, 300],
                ids: ['#toolbar', ...viewIds]
            }
        }
    }
}