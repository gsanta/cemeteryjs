import { Parser } from '../parsers/Parser';
import { WorldItem } from '../WorldItemInfo';

export class ParserService {

    apply(worldMap: string, parser: Parser): WorldItem[] {
        return parser.generateFromStringMap(worldMap);
    }
}