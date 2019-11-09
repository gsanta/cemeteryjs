import { WorldItem } from '../../WorldItem';
import { WorldItemBuilder } from '../builders/WorldItemBuilder';

export class BuilderService {
    apply(worldMap: string, parser: WorldItemBuilder): WorldItem[] {
        return parser.parse(worldMap);
    }
}