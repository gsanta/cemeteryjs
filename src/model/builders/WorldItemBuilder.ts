import { WorldItem } from '../../WorldItem';

export interface WorldItemBuilder {
    parse(worldMap: string): WorldItem[];
}