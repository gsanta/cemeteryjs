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
import { SvgWorldMapReader } from '../readers/svg/SvgWorldMapReader';
import { TextWorldMapReader } from '../readers/text/TextWorldMapReader';
import { WorldMapToRoomMapConverter } from '../readers/text/WorldMapToRoomMapConverter';
import { ServiceFacade } from './ServiceFacade';
import { WorldMapToSubareaMapConverter } from '../readers/text/WorldMapToSubareaMapConverter';
import { WorldMapReader } from '../readers/WorldMapReader';
import { InputConverter } from '../readers/InputConverter';

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

    private worldMapReader: WorldMapReader;
    private roomInputConverter: InputConverter;
    private subareaInputConverter: InputConverter;

    constructor(
        services: ServiceFacade<M, S, T>,
        worldMapReader: WorldMapReader,
        roomInputConverter: InputConverter,
        subareaInputConverter: InputConverter
    ) {
        this.services = services;
        this.worldMapReader = worldMapReader;
        this.roomInputConverter = roomInputConverter;
        this.subareaInputConverter = subareaInputConverter;
    }

    import(worldMap: string, modNames?: string[]): WorldItem[] {
        let worldItems = this.services.builderService.apply(
            worldMap,
            new CombinedWorldItemBuilder(
                [
                    new FurnitureBuilder(this.services, this.worldMapReader),
                    new BorderBuilder(this.services, this.worldMapReader),
                    new RoomBuilder(this.services, this.worldMapReader, this.roomInputConverter),
                    new RootWorldItemBuilder(this.services.worldItemFactoryService, this.worldMapReader),
                    new SubareaBuilder(this.services, this.worldMapReader, this.subareaInputConverter)
                ]
            )
        );

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
            CreateMeshModifier.modName
        ];

        return this.services.modifierService.applyModifiers(worldItems, modNames);
    }
}