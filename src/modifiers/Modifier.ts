import { WorldItem } from '../WorldItemInfo';


export interface Modifier {
    getName(): string;
    apply(worldItems: WorldItem[]): WorldItem[];
}