import { GameObject } from '../services/GameObject';


export interface Modifier {
    getName(): string;
    apply(worldItems: GameObject[]): GameObject[];
}