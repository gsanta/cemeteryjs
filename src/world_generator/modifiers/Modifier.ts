import { GameObject } from '../services/GameObject';


export interface Modifier {
    dependencies: string[];
    getName(): string;
    apply(worldItems: GameObject[]): GameObject[];
}