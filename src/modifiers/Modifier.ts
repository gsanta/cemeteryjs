import { WorldItem } from '../WorldItemInfo';


export interface Modifier {
    apply(worldItems: WorldItem[]): WorldItem[];
}