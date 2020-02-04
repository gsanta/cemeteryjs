import { EditorFacade } from "../controllers/EditorFacade";
import { ViewType, View } from "../../model/View";
import { maxBy } from "../../model/geometry/utils/Functions";


export class NamingService {
    private services: EditorFacade;

    constructor(services: EditorFacade) {
        this.services = services;
    }

    generateName(type: ViewType) {
        return `${type}${this.getMaxIndex(type) + 1}`.toLocaleLowerCase();
    }

    private getMaxIndex(type: ViewType): number {
        const pattern = this.createPattern(type);
        const views = this.services.viewStore.getViewsByType(type).filter(view => type.match(pattern));

        if (views.length === 0) {
            return 0;
        } else {
            const max = maxBy<View>(views, (a, b) => parseInt(a.viewType.match(pattern)[1], 10) - parseInt(b.viewType.match(pattern)[1], 10));
            return parseInt(max.viewType.match(pattern)[1], 10);
        }

    }

    private createPattern(type: ViewType) {
        return new RegExp(`${type}(\\d+)`, 'i');
    }
}