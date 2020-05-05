import { ConceptType, Concept } from '../models/concepts/Concept';
import { maxBy } from '../../misc/geometry/utils/Functions';


export abstract class AbstractStore {

    protected abstract getConceptsByType(type: ConceptType): Concept[];

    generateUniqueName(type: ConceptType) {
        const name = `${type}${this.getMaxIndex(type) + 1}`.toLocaleLowerCase();
        return name;
    }

    private getMaxIndex(type: ConceptType): number {
        const pattern = this.createPattern(type);
        const views = this.getConceptsByType(type).filter(view => view.id.match(pattern));

        if (views.length === 0) {
            return 0;
        } else {
            const max = maxBy<Concept>(views, (a, b) => parseInt(a.id.match(pattern)[1], 10) - parseInt(b.id.match(pattern)[1], 10));
            return parseInt(max.id.match(pattern)[1], 10);
        }

    }

    private createPattern(type: ConceptType) {
        return new RegExp(`${type}(\\d+)`, 'i');
    }
}