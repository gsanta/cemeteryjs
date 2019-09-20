import { WorldItem } from '../../WorldItem';


export interface Modifier {
    dependencies: string[];
    getName(): string;
    apply(worldItems: WorldItem[]): WorldItem[];
}