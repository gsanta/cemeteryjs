import { View } from '../View';
import { Registry } from '../Registry';
import { CanvasView } from '../../plugins/scene_editor/CanvasView';
import { GameView } from '../../plugins/game_viewer/GameView';
import { ActionEditorView } from '../../plugins/action_editor/ActionEditorView';

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
    private hoveredView: View;
    private fullScreen: View;
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
                ids: ['toolbar', CanvasView.id, GameView.id],
                name: Layout.SceneEditor
            },
            {
                sizes: [12, 88],
                minSize: [230, 500],
                ids: ['toolbar', ActionEditorView.id],
                name: Layout.ActionEditor
            }
        ];

        this.activeLayout = this.layouts[0];
    }
    
    setHoveredView(view: View) {
        this.hoveredView = view;
    }

    getHoveredView(): View {
        return this.hoveredView;
    }

    setActiveLayout(layout: LayoutConfig) {
        this.activeLayout = layout;
        this.visibilityDirty = true;
    }

    getActiveViews(): View[] {
        return this.fullScreen ? [this.fullScreen] : this.registry.views.views.filter(view => this.activeLayout.ids.find(id => view.getId() === id));
    }

    setFullScreen(view: View) {
        this.visibilityDirty = true;
        this.fullScreen = view;
    }

    getFullScreen(): View {
        return this.fullScreen;
    }

    getAllViews(): View[] {
        return this.registry.views.views;
    }

    getViewById<T extends View = View>(id: string): T {
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