import { AbstractShape } from "./AbstractShape"


export class ChildShapeContext {
    private views: AbstractShape[] = [];

    addView(view: AbstractShape) {
        this.views = Array.from(new Set([...this.views, view]));
    }

    removeView(view: AbstractShape) {
        this.views = this.views.filter(v => v !== view);
    }

    getViews(): AbstractShape[] {
        return this.views;
    }
}