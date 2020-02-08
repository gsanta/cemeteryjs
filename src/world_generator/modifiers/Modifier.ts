import { GameObject } from '../services/GameObject';
import { MeshObject } from '../../game/models/objects/MeshObject';


export interface Modifier {
    getName(): string;
    apply(meshObject: MeshObject[]): MeshObject[];
}