import { WorldItemType } from '../../WorldItemType';
import { WorldItem } from "../../WorldItem";
import { AssignBordersToRoomsModifier } from "../modifiers/AssignBordersToRoomsModifier";
import { BuildHierarchyModifier } from "../modifiers/BuildHierarchyModifier";
import { ChangeBorderWidthModifier } from "../modifiers/ChangeBorderWidthModifier";
import { ChangeFurnitureSizeModifier } from "../modifiers/ChangeFurnitureSizeModifier";
import { CreateMeshModifier } from '../modifiers/CreateMeshModifier';
import { NormalizeBorderRotationModifier } from "../modifiers/NormalizeBorderRotationModifier";
import { SplitWallsIntoTwoParallelChildWallsModifier } from "../modifiers/SplitWallsIntoTwoParallelChildWallsModifier";
import { ThickenBordersModifier } from "../modifiers/ThickenBordersModifier";
import { CombinedWorldItemBuilder } from "../builders/CombinedWorldItemBuilder";
import { FurnitureBuilder } from "../builders/FurnitureBuilder";
import { RoomBuilder } from "../builders/RoomBuilder";
import { RootWorldItemBuilder } from "../builders/RootWorldItemBuilder";
import { SubareaBuilder } from '../builders/SubareaBuilder';
import { ServiceFacade } from './ServiceFacade';
import { ScaleModifier } from '../modifiers/ScaleModifier';
import { BorderBuilder } from '../builders/BorderBuilder';
import { SegmentBordersModifier } from '../modifiers/SegmentBordersModifier';
import { TextWorldMapReader } from '../readers/text/TextWorldMapReader';
import { SvgWorldMapReader } from '../readers/svg/SvgWorldMapReader';
import { WorldMapToRoomMapConverter } from '../readers/text/WorldMapToRoomMapConverter';

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
        const worldMapToRoomMapConverter = new WorldMapToRoomMapConverter(this.services.configService);
        const roomMap = worldMapToRoomMapConverter.convert(worldMap);

        let worldItems = this.services.parserService.apply(
            worldMap,
            new CombinedWorldItemBuilder(
                [
                    new FurnitureBuilder(this.services, new TextWorldMapReader(this.services.configService)),
                    new BorderBuilder(this.services, new TextWorldMapReader(this.services.configService)),
                    new RoomBuilder(this.services, new TextWorldMapReader(this.services.configService)),
                    // new PolygonAreaParser('empty', this.services.configService.meshDescriptorMap.get('room').char, this.services),
                    new RootWorldItemBuilder(this.services.worldItemFactoryService, new TextWorldMapReader(this.services.configService)),
                    new SubareaBuilder(this.services, new TextWorldMapReader(this.services.configService))
                ]
            )
        );

        modNames = modNames ? modNames : [
            SegmentBordersModifier.modName,
            BuildHierarchyModifier.modName,
            AssignBordersToRoomsModifier.modName,
            ScaleModifier.modName,
            // ConvertBorderPolyToLineModifier.modName,
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