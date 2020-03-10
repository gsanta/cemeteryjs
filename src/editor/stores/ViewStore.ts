import { View } from '../views/View';

export class ViewStore {
    private views: View[] = [];
    private activeView: View;
    
    registerView(view: View) {
        this.views.push(view);
    }

    setActiveView(view: View) {
        this.activeView = view;
    }

    getActiveView(): View {
        return this.activeView;
    }

    getViewById<T extends View = View>(id: string): T {
        return <T> this.views.find(view => view.getId() === id);
    }
}