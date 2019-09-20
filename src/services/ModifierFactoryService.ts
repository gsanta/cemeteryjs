import { Modifier } from '../model/modifiers/Modifier';
import { ServiceFacade } from './ServiceFacade';
import { SplitWallsIntoTwoParallelChildWallsModifier } from '../model/modifiers/SplitWallsIntoTwoParallelChildWallsModifier';
import { AddRoofModifier } from '../model/modifiers/AddRoofModifier';
import { AssignBordersToRoomsModifier } from '../model/modifiers/AssignBordersToRoomsModifier';
import { BuildHierarchyModifier } from '../model/modifiers/BuildHierarchyModifier';
import { ChangeBorderWidthModifier } from '../model/modifiers/ChangeBorderWidthModifier';
import { ChangeFurnitureSizeModifier } from '../model/modifiers/ChangeFurnitureSizeModifier';
import { ConvertBorderPolyToLineModifier } from '../model/modifiers/ConvertBorderPolyToLineModifier';
import { CreateMeshModifier } from '../model/modifiers/CreateMeshModifier';
import { NormalizeBorderRotationModifier } from '../model/modifiers/NormalizeBorderRotationModifier';
import { ScaleModifier } from '../model/modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../model/modifiers/SegmentBordersModifier';
import { ThickenBordersModifier } from '../model/modifiers/ThickenBordersModifier';
import { TransformToWorldCoordinateModifier } from '../model/modifiers/TransformToWorldCoordinateModifier';

export class ModifierFactoryService {
    private modifierMap: Map<string, Modifier> = new Map();

    constructor(services: ServiceFacade<any, any, any>) {

        this
            .registerInstance(new SplitWallsIntoTwoParallelChildWallsModifier(services.worldItemFactoryService, services.geometryService))
            .registerInstance(new AddRoofModifier(services.worldItemFactoryService))
            .registerInstance(new AssignBordersToRoomsModifier(services.configService))
            .registerInstance(new BuildHierarchyModifier())
            .registerInstance(new ChangeBorderWidthModifier(services.configService))
            .registerInstance(new ChangeFurnitureSizeModifier(services.meshTamplateService))
            .registerInstance(new ConvertBorderPolyToLineModifier(services.geometryService))
            .registerInstance(new CreateMeshModifier(services.meshFactoryService, services.meshTamplateService, services.configService))
            .registerInstance(new NormalizeBorderRotationModifier())
            .registerInstance(new ScaleModifier(services.configService))
            .registerInstance(new SegmentBordersModifier(services.configService, services.worldItemFactoryService, services.geometryService))
            .registerInstance(new ThickenBordersModifier())
            .registerInstance(new TransformToWorldCoordinateModifier());
    }

    getInstance(modName: string): Modifier {
        if (!this.modifierMap.has(modName)) {
            throw new Error(`No registered modifier found for modName: ${modName}`);
        }

        return this.modifierMap.get(modName);
    }

    registerInstance(modifier: Modifier): ModifierFactoryService {
        this.modifierMap.set(modifier.getName(), modifier);

        return this;
    }
}