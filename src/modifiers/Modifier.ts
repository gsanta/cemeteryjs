import { WorldItemInfo } from '../WorldItemInfo';


export interface Modifier {
    apply(worldItems: WorldItemInfo[]): WorldItemInfo[];
}