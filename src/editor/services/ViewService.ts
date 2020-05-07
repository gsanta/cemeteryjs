import { View } from '../views/View';
import { Registry } from '../Registry';

export interface ViewConfig {
    sizes: number[];
    ids: number[];
    minSizes: number[];
}

export class ViewService {
    private views: View[] = [];
    private activeView: View;
    private visibleViews: View[] = [];
    private fullScreen: View;
    visibilityDirty = true;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
    
    registerView(view: View) {
        this.views.push(view);
    }

    setActiveView(view: View) {
        this.activeView = view;
    }

    getActiveView(): View {
        return this.activeView;
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

    getVisibleViews(): View[] {
        return this.fullScreen ? [this.fullScreen] : this.views;
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
            const viewIds = this.getVisibleViews().map(view => `#${view.getId()}-split`);
            
            return {
                sizes: [12, 44, 44],
                minSize: [230, 300, 300],
                ids: ['#toolbar', ...viewIds]
            }
        }
    }
}