import { WorldItem } from '../WorldItemInfo';


export interface Modifier {
    dependencies: string[];
    getName(): string;
    apply(worldItems: WorldItem[]): WorldItem[];
}