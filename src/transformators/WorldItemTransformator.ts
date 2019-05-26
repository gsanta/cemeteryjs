import { WorldItemInfo } from '../WorldItemInfo';


export interface WorldItemTransformator {
    transform(gwmWorldItems: WorldItemInfo[]): WorldItemInfo[];
}