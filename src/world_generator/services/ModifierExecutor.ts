import { Modifier } from '../modifiers/Modifier';
import { GameObject } from './GameObject';
import { SplitWallsIntoTwoParallelChildWallsModifier } from '../modifiers/SplitWallsIntoTwoParallelChildWallsModifier';
import { AddRoofModifier } from '../modifiers/AddRoofModifier';
import { AssignBordersToRoomsModifier } from '../modifiers/AssignBordersToRoomsModifier';
import { BuildHierarchyModifier } from '../modifiers/BuildHierarchyModifier';
import { ChangeBorderWidthModifier } from '../modifiers/ChangeBorderWidthModifier';
import { ChangeFurnitureSizeModifier } from '../modifiers/ChangeFurnitureSizeModifier';
import { NormalizeBorderRotationModifier } from '../modifiers/NormalizeBorderRotationModifier';
import { ScaleModifier } from '../modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../modifiers/SegmentBordersModifier';
import { ThickenBordersModifier } from '../modifiers/ThickenBordersModifier';
import { WorldGeneratorServices } from './WorldGeneratorServices';
import { CreateMeshModifier } from '../modifiers/CreateMeshModifier';

export const defaultModifiers = [
    SegmentBordersModifier.modName,
    BuildHierarchyModifier.modName,
    AssignBordersToRoomsModifier.modName,
    ScaleModifier.modName,
    ChangeBorderWidthModifier.modName,
    ThickenBordersModifier.modName,
    SplitWallsIntoTwoParallelChildWallsModifier.modName,
    NormalizeBorderRotationModifier.modName,
    ChangeFurnitureSizeModifier.modeName,
    CreateMeshModifier.modName
];

export class ModifierExecutor {
    private modifierMap: Map<string, Modifier> = new Map();

    constructor(services: WorldGeneratorServices) {
        this.registerModifier(new SplitWallsIntoTwoParallelChildWallsModifier(services.gameObjectFactory));
        this.registerModifier(new AddRoofModifier(services.gameObjectFactory));
        this.registerModifier(new AssignBordersToRoomsModifier(services));
        this.registerModifier(new BuildHierarchyModifier(services));
        this.registerModifier(new ChangeBorderWidthModifier(services));
        this.registerModifier(new ChangeFurnitureSizeModifier(services));
        this.registerModifier(new NormalizeBorderRotationModifier());
        this.registerModifier(new ScaleModifier(services));
        this.registerModifier(new SegmentBordersModifier(services));
        this.registerModifier(new ThickenBordersModifier());
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