import { View } from '../views/View';
import { Registry } from '../Registry';
import { CanvasView } from '../views/canvas/CanvasView';
import { RendererView } from '../views/renderer/RendererView';
import { ActionEditorView } from '../views/action_editor/ActionEditorView';

export interface LayoutConfig {
    sizes: number[];
    ids: string[];
    minSize: number[];
    name?: string;
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
                ids: ['#toolbar', CanvasView.id, RendererView.id],
                name: 'Scene Editor'
            },
            {
                sizes: [12, 88],
                minSize: [230, 500],
                ids: ['#toolbar', ActionEditorView.id],
                name: 'Action Editor'
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