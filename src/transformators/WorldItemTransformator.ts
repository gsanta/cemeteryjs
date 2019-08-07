import { WorldItemInfo } from '../WorldItemInfo';


export interface WorldItemTransformator {
    transform(worldItems: WorldItemInfo[]): WorldItemInfo[];
}