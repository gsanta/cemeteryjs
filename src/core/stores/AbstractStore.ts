import { maxBy } from '../geometry/utils/Functions';
import { ConceptType, Concept } from '../models/concepts/Concept';
import { FeedbackType } from '../models/controls/IControl';
import { Hoverable } from '../models/Hoverable';


export abstract class AbstractStore {

    protected abstract getItemsByType(type: string): Hoverable[];
    abstract removeItemById(id: string);

    generateUniqueName(type: string) {
        const name = `${type}${this.getMaxIndex(type) + 1}`.toLocaleLowerCase();
        return name;
    }

    private getMaxIndex(type: string): number {
        const pattern = this.createPattern(type);
        const views = this.getItemsByType(type).filter(view => view.id.match(pattern));

        if (views.length === 0) {
            return 0;
        } else {
            const max = maxBy<Concept>(views, (a, b) => parseInt(a.id.match(pattern)[1], 10) - parseInt(b.id.match(pattern)[1], 10));
            return parseInt(max.id.match(pattern)[1], 10);
        }

    }

    private createPattern(type: string) {
        return new RegExp(`${type}(\\d+)`, 'i');
    }
}