import { WorldItemBuilder, Format } from '../builders/WorldItemBuilder';
import { WorldItem } from '../../WorldItem';

export class ParserService {

    apply(worldMap: string, parser: WorldItemBuilder): WorldItem[] {
        return parser.parse(worldMap, Format.TEXT);
    }
}