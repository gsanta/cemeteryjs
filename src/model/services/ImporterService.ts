import { WorldItem } from "../../WorldItem";
import { WorldItemDefinition } from '../../WorldItemDefinition';
import { BorderBuilder } from '../builders/BorderBuilder';
import { CombinedWorldItemBuilder } from "../builders/CombinedWorldItemBuilder";
import { FurnitureBuilder } from "../builders/FurnitureBuilder";
import { RoomBuilder } from "../builders/RoomBuilder";
import { RootWorldItemBuilder } from "../builders/RootWorldItemBuilder";
import { SubareaBuilder } from '../builders/SubareaBuilder';
import { AssignBordersToRoomsModifier } from "../modifiers/AssignBordersToRoomsModifier";
import { BuildHierarchyModifier } from "../modifiers/BuildHierarchyModifier";
import { ChangeBorderWidthModifier } from "../modifiers/ChangeBorderWidthModifier";
import { ChangeFurnitureSizeModifier } from "../modifiers/ChangeFurnitureSizeModifier";
import { CreateMeshModifier } from '../modifiers/CreateMeshModifier';
import { NormalizeBorderRotationModifier } from "../modifiers/NormalizeBorderRotationModifier";
import { ScaleModifier } from '../modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../modifiers/SegmentBordersModifier';
import { SplitWallsIntoTwoParallelChildWallsModifier } from "../modifiers/SplitWallsIntoTwoParallelChildWallsModifier";
import { ThickenBordersModifier } from "../modifiers/ThickenBordersModifier";
import { ServiceFacade } from './ServiceFacade';
import { WorldMapReader } from '../readers/WorldMapReader';
import { InputConverter } from '../readers/InputConverter';
import { PolygonBuilder } from '../builders/polygon/PolygonBuilder';
import { TransformToWorldCoordinateModifier } from '../modifiers/TransformToWorldCoordinateModifier';
import { IWorldItemBuilder } from '../io/IWorldItemBuilder';

export interface WorldConfig {
    borders: string[];
    furnitures: string[];
    xScale: number;
    yScale: number;
    meshDescriptors: WorldItemDefinition[];
}

export const defaultWorldConfig: WorldConfig = {
    borders: ['wall', 'door', 'window'],
    furnitures: ['player', 'cupboard', 'table', 'bathtub', 'washbasin', 'bed', 'chair', 'portal', 'double_bed', 'shelves'],
    xScale: 1,
    yScale: 2,
    meshDescriptors: []
}


export class ImporterService<M, S, T> {
    private services: ServiceFacade<M, S, T>;

    private worldItemBuilder: IWorldItemBuilder;

    constructor(services: ServiceFacade<M, S, T>, worldItemBuilder: IWorldItemBuilder) {
        this.services = services;
        this.worldItemBuilder = worldItemBuilder;
    }

    import(worldMap: string, modNames?: string[]): WorldItem[] {
        let worldItems = this.worldItemBuilder.build(worldMap);

        modNames = modNames ? modNames : [
            SegmentBordersModifier.modName,
            BuildHierarchyModifier.modName,
            AssignBordersToRoomsModifier.modName,
            ScaleModifier.modName,
            ChangeBorderWidthModifier.modName,
            ThickenBordersModifier.modName,
            SplitWallsIntoTwoParallelChildWallsModifier.modName,
            NormalizeBorderRotationModifier.modName,
            ChangeFurnitureSizeModifier.modeName,
            TransformToWorldCoordinateModifier.modName,
            CreateMeshModifier.modName
        ];

        return this.services.modifierService.applyModifiers(worldItems, modNames);
    }
}