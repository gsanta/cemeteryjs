import { WorldItem } from '../../WorldItem';
import { WorldItemBuilder, Format } from './WorldItemBuilder';
import { flat } from '../utils/Functions';

/**
 * The goal of this generator is to combine multiple generators together each of which parses the input worldmap string
 * from a different aspect, and emits all of the `WorldItem`s merged together.
 */
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