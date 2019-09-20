import { WorldItem } from '../../WorldItem';
import { Parser } from './Parser';
import _ = require('lodash');
import { flat } from '../../utils/ArrayUtils';

/**
 * The goal of this generator is to combine multiple generators together each of which parses the input worldmap string
 * from a different aspect, and emits all of the `WorldItem`s merged together.
 */
export class CombinedWorldItemParser implements Parser {
    private parsers: Parser[];

    constructor(parsers: Parser[]) {
        this.parsers = parsers;
    }

    public parse(worldMap: string): WorldItem[] {
        const results = this.parsers.map(parser => parser.parse(worldMap));

        return flat<WorldItem>(results, 2);
    }
}