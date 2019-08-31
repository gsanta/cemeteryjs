import { WorldMapToMatrixGraphConverter } from "../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { AddOuterBorderLayerModifier } from "../modifiers/AddOuterBorderLayerModifier";
import { AssignBordersToRoomsModifier } from "../modifiers/AssignBordersToRoomsModifier";
import { BuildHierarchyModifier } from "../modifiers/BuildHierarchyModifier";
import { ChangeBorderWidthModifier } from "../modifiers/ChangeBorderWidthModifier";
import { ChangeFurnitureSizeModifier } from "../modifiers/ChangeFurnitureSizeModifier";
import { ConvertBorderPolyToLineModifier } from "../modifiers/ConvertBorderPolyToLineModifier";
import { CreateMeshModifier } from '../modifiers/CreateMeshModifier';
import { NormalizeBorderRotationModifier } from "../modifiers/NormalizeBorderRotationModifier";
import { ScaleModifier } from "../modifiers/ScaleModifier";
import { SegmentBordersModifier } from "../modifiers/SegmentBordersModifier";
import { ThickenBordersModifier } from "../modifiers/ThickenBordersModifier";
import { CombinedWorldItemParser } from "../parsers/CombinedWorldItemParser";
import { FurnitureInfoParser } from "../parsers/furniture_parser/FurnitureInfoParser";
import { PolygonAreaInfoParser } from "../parsers/polygon_area_parser/PolygonAreaInfoParser";
import { RoomInfoParser } from "../parsers/room_parser/RoomInfoParser";
import { RoomSeparatorParser } from "../parsers/room_separator_parser/RoomSeparatorParser";
import { RootWorldItemParser } from "../parsers/RootWorldItemParser";
import { WorldItem } from "../WorldItemInfo";
import { ServiceFacade } from './ServiceFacade';

export interface WorldConfig {
    borders: string[];
    furnitures: string[];
    xScale: number;
    yScale: number;
}

export const defaultWorldConfig: WorldConfig = {
    borders: ['wall', 'door', 'window'],
    furnitures: ['player', 'cupboard', 'table', 'bathtub', 'washbasin', 'bed', 'chair', 'portal'],
    xScale: 1,
    yScale: 2
}


export class ImporterService<M, S, T> {
    private services: ServiceFacade<M, S, T>;

    constructor(services: ServiceFacade<M, S, T>) {
        this.services = services;
    }

    import(worldMap: string, modNames?: string[]): WorldItem[] {
        let worldItems = this.services.parserService.apply(
            worldMap,
            new CombinedWorldItemParser(
                [
                    new FurnitureInfoParser(this.services.worldItemFactoryService, this.services.configService.furnitureTypes, new WorldMapToMatrixGraphConverter()),
                    new RoomSeparatorParser(this.services.worldItemFactoryService, this.services.configService.borderTypes),
                    new RoomInfoParser(this.services.worldItemFactoryService),
                    new PolygonAreaInfoParser('empty', this.services.worldItemFactoryService),
                    new RootWorldItemParser(this.services.worldItemFactoryService)
                ]
            )
        );

        modNames = modNames ? modNames : [
            ScaleModifier.modName,
            SegmentBordersModifier.modName,
            BuildHierarchyModifier.modName,
            AssignBordersToRoomsModifier.modName,
            ConvertBorderPolyToLineModifier.modName,
            ChangeBorderWidthModifier.modName,
            ThickenBordersModifier.modName,
            AddOuterBorderLayerModifier.modName,
            NormalizeBorderRotationModifier.modName,
            ChangeFurnitureSizeModifier.modeName,
            CreateMeshModifier.modName
        ];

        return this.services.modifierService.applyModifiers(worldItems, modNames);
    }
}