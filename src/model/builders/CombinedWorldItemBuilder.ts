import { WorldItem } from '../../WorldItem';
import { flat } from '../utils/Functions';
import { WorldItemBuilder } from './WorldItemBuilder';

export class CombinedWorldItemBuilder implements WorldItemBuilder {
    private parsers: WorldItemBuilder[];

    constructor(parsers: WorldItemBuilder[]) {
        this.parsers = parsers;
    }

    public parse(worldMap: string): WorldItem[] {
        const results = this.parsers.map(parser => parser.parse(worldMap));

        return flat<WorldItem>(results, 2);
    }
}