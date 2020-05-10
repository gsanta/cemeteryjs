import { View } from '../../editor/views/View';
import { Registry } from '../../editor/Registry';
import { CanvasView } from '../../plugins/scene_editor/CanvasView';
import { RendererView } from '../../plugins/game_view/RendererView';
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

export class ViewService {
    private views: View[] = [];
    private hoveredView: View;
    private fullScreen: View;
    visibilityDirty = true;

    activeLayout: LayoutConfig;
    layouts: LayoutConfig[];

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;

        this.views = [
            new CanvasView(this.registry),
            new RendererView(this.registry),
            new ActionEditorView(this.registry)
        ];

        this.hoveredView = this.views[0];

        this.layouts = [
            {
                sizes: [12, 44, 44],
                minSize: [230, 300, 300],
                ids: ['toolbar', CanvasView.id, RendererView.id],
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
    
    registerView(view: View) {
        this.views.push(view);
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
        return this.fullScreen ? [this.fullScreen] : this.views.filter(view => this.activeLayout.ids.find(id => view.getId() === id));
    }

    setFullScreen(view: View) {
        this.visibilityDirty = true;
        this.fullScreen = view;
    }

    getFullScreen(): View {
        return this.fullScreen;
    }

    getAllViews(): View[] {
        return this.views;
    }

    getViewById<T extends View = View>(id: string): T {
        return <T> this.views.find(view => view.getId() === id);
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