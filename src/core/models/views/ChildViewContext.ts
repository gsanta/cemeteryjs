import { View } from "./View"


export class ChildViewContext {
    private views: View[] = [];

    addView(view: View) {
        this.views = Array.from(new Set([...this.views, view]));
    }

    removeView(view: View) {
        this.views = this.views.filter(v => v !== view);
    }

    getViews(): View[] {
        return this.views;
    }
}