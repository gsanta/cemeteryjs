import { EditorFacade } from "../controllers/EditorFacade";
import { ViewType, View } from "../../common/views/View";
import { maxBy } from "../../misc/geometry/utils/Functions";


export class NamingService {
    private services: EditorFacade;

    constructor(services: EditorFacade) {
        this.services = services;
    }

    generateName(type: ViewType) {
        const name = `${type}${this.getMaxIndex(type) + 1}`.toLocaleLowerCase();
        return name;
    }

    private getMaxIndex(type: ViewType): number {
        const pattern = this.createPattern(type);
        const views = this.services.viewStore.getViewsByType(type).filter(view => view.name.match(pattern));

        if (views.length === 0) {
            return 0;
        } else {
            const max = maxBy<View>(views, (a, b) => parseInt(a.name.match(pattern)[1], 10) - parseInt(b.name.match(pattern)[1], 10));
            return parseInt(max.name.match(pattern)[1], 10);
        }

    }

    private createPattern(type: ViewType) {
        return new RegExp(`${type}(\\d+)`, 'i');
    }
}