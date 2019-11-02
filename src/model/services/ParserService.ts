import { Parser, Format } from '../parsers/Parser';
import { WorldItem } from '../../WorldItem';

export class ParserService {

    apply(worldMap: string, parser: Parser): WorldItem[] {
        return parser.parse(worldMap, Format.TEXT);
    }
}