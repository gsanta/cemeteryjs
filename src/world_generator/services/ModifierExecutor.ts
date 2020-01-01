import { Modifier } from '../modifiers/Modifier';
import { GameObject } from './GameObject';
import { BuildHierarchyModifier } from '../modifiers/BuildHierarchyModifier';
import { ScaleModifier } from '../modifiers/ScaleModifier';
import { WorldGeneratorFacade } from '../WorldGeneratorFacade';
import { CreateMeshModifier } from '../modifiers/CreateMeshModifier';
import { Mesh } from 'babylonjs';

export const defaultModifiers = [
    BuildHierarchyModifier.modName,
    ScaleModifier.modName,
    CreateMeshModifier.modName
];

export class ModifierExecutor {
    private modifierMap: Map<string, Modifier> = new Map();

    constructor() {
        this.registerModifier(new BuildHierarchyModifier());
        this.registerModifier(new ScaleModifier());
    }

    applyModifiers(worldItems: GameObject[], modNames: string[]): GameObject[] {
        return modNames
            .map(name => this.modifierMap.get(name))
            .reduce((gameObjects, transformator) => transformator.apply(gameObjects), worldItems);
    }

    registerModifier(modifier: Modifier): void {
        this.modifierMap.set(modifier.getName(), modifier);
    }
}