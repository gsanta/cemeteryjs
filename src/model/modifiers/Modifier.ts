import { GameObject } from '../types/GameObject';


export interface Modifier {
    dependencies: string[];
    getName(): string;
    apply(worldItems: GameObject[]): GameObject[];
}