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
}