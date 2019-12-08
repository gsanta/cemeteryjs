import { WorldItem } from '../../WorldItem';

export interface IWorldItemBuilder {
    build(worldMap: string): WorldItem[];
}