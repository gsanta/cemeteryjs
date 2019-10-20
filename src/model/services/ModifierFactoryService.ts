import { Modifier } from '../modifiers/Modifier';
import { ServiceFacade } from './ServiceFacade';
import { SplitWallsIntoTwoParallelChildWallsModifier } from '../modifiers/SplitWallsIntoTwoParallelChildWallsModifier';
import { AddRoofModifier } from '../modifiers/AddRoofModifier';
import { AssignBordersToRoomsModifier } from '../modifiers/AssignBordersToRoomsModifier';
import { BuildHierarchyModifier } from '../modifiers/BuildHierarchyModifier';
import { ChangeBorderWidthModifier } from '../modifiers/ChangeBorderWidthModifier';
import { ChangeFurnitureSizeModifier } from '../modifiers/ChangeFurnitureSizeModifier';
import { ConvertBorderPolyToLineModifier } from '../modifiers/ConvertBorderPolyToLineModifier';
import { CreateMeshModifier } from '../modifiers/CreateMeshModifier';
import { NormalizeBorderRotationModifier } from '../modifiers/NormalizeBorderRotationModifier';
import { ScaleModifier } from '../modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../modifiers/SegmentBordersModifier';
import { ThickenBordersModifier } from '../modifiers/ThickenBordersModifier';
import { TransformToWorldCoordinateModifier } from '../modifiers/TransformToWorldCoordinateModifier';
import { SegmentBordersModifierNew } from '../modifiers/SegmentBordersModifierNew';

export class ModifierFactoryService {
    private modifierMap: Map<string, Modifier> = new Map();

    constructor(services: ServiceFacade<any, any, any>) {

        this
            .registerInstance(new SplitWallsIntoTwoParallelChildWallsModifier(services.worldItemFactoryService, services.geometryService))
            .registerInstance(new AddRoofModifier(services.worldItemFactoryService))
            .registerInstance(new AssignBordersToRoomsModifier(services.configService))
            .registerInstance(new BuildHierarchyModifier(services))
            .registerInstance(new ChangeBorderWidthModifier(services.configService))
            .registerInstance(new ChangeFurnitureSizeModifier(services))
            .registerInstance(new ConvertBorderPolyToLineModifier(services.geometryService))
            .registerInstance(new CreateMeshModifier(services.meshFactoryService, services.meshTemplateService, services.configService))
            .registerInstance(new NormalizeBorderRotationModifier())
            .registerInstance(new ScaleModifier(services))
            .registerInstance(new SegmentBordersModifier(services))
            .registerInstance(new ThickenBordersModifier())
            .registerInstance(new TransformToWorldCoordinateModifier())
            .registerInstance(new SegmentBordersModifierNew(services));
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