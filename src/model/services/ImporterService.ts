import { WorldItem } from "../../WorldItem";
import { WorldItemType } from '../../WorldItemType';
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

export interface WorldConfig {
    borders: string[];
    furnitures: string[];
    xScale: number;
    yScale: number;
    meshDescriptors: WorldItemType[];
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

    constructor(services: ServiceFacade<M, S, T>) {
        this.services = services;
    }

    import(worldMap: string, modNames?: string[]): WorldItem[] {
        const configService = this.services.configService;

        let worldItems = this.services.parserService.apply(
            worldMap,
            new CombinedWorldItemBuilder(
                [
                    new FurnitureBuilder(this.services, new TextWorldMapReader(configService)),
                    new BorderBuilder(this.services, new TextWorldMapReader(configService)),
                    new RoomBuilder(this.services, new TextWorldMapReader(configService), new WorldMapToRoomMapConverter(configService)),
                    new RootWorldItemBuilder(this.services.worldItemFactoryService, new TextWorldMapReader(configService)),
                    new SubareaBuilder(this.services, new TextWorldMapReader(configService), new WorldMapToSubareaMapConverter(configService))
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

    importSvg(worldMap: string, modNames?: string[]): WorldItem[] {
        let worldItems = this.services.parserService.apply(
            worldMap,
            new CombinedWorldItemBuilder(
                [
                    new FurnitureBuilder(this.services, new SvgWorldMapReader()),
                    new BorderBuilder(this.services, new SvgWorldMapReader()),
                    new RoomBuilder(this.services, new SvgWorldMapReader()),
                    new RootWorldItemBuilder(this.services.worldItemFactoryService, new SvgWorldMapReader()),
                    new SubareaBuilder(this.services, new SvgWorldMapReader())
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