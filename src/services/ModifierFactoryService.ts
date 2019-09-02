import { Modifier } from '../modifiers/Modifier';
import { ServiceFacade } from './ServiceFacade';
import { AddOuterBorderLayerModifier } from '../modifiers/AddOuterBorderLayerModifier';
import { AddRoofModifier } from '../modifiers/AddRoofModifier';
import { AssignBordersToRoomsModifier } from '../modifiers/AssignBordersToRoomsModifier';
import { BuildHierarchyModifier } from '../modifiers/BuildHierarchyModifier';
import { ChangeBorderWidthModifier } from '../modifiers/ChangeBorderWidthModifier';
import { ChangeFurnitureSizeModifier } from '../modifiers/ChangeFurnitureSizeModifier';
import { ConvertBorderPolyToLineModifier } from '../modifiers/ConvertBorderPolyToLineModifier';
import { CreateMeshModifier } from '../modifiers/CreateMeshModifier';
import { CreateMockMeshModifier, MockMeshCreator } from '../modifiers/CreateMockMeshModifier';
import { NormalizeBorderRotationModifier } from '../modifiers/NormalizeBorderRotationModifier';
import { ScaleModifier } from '../modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../modifiers/SegmentBordersModifier';
import { ThickenBordersModifier } from '../modifiers/ThickenBordersModifier';
import { TransformToWorldCoordinateModifier } from '../modifiers/TransformToWorldCoordinateModifier';

export class ModifierFactoryService {
    private modifierMap: Map<string, Modifier> = new Map();

    constructor(services: ServiceFacade<any, any, any>) {

        this
            .registerInstance(new AddOuterBorderLayerModifier(services.worldItemFactoryService))
            .registerInstance(new AddRoofModifier(services.worldItemFactoryService))
            .registerInstance(new AssignBordersToRoomsModifier(services.configService))
            .registerInstance(new BuildHierarchyModifier())
            .registerInstance(new ChangeBorderWidthModifier(services.configService))
            .registerInstance(new ChangeFurnitureSizeModifier(services.configService))
            .registerInstance(new ConvertBorderPolyToLineModifier())
            .registerInstance(new CreateMeshModifier(services.meshFactoryService, services.meshLoaderService, services.configService))
            .registerInstance(new NormalizeBorderRotationModifier())
            .registerInstance(new ScaleModifier(services.configService))
            .registerInstance(new SegmentBordersModifier(services.configService, services.worldItemFactoryService))
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