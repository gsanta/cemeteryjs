import { WorldItem } from "../WorldItemInfo";
import { MeshLoaderService } from './MeshLoaderService';
import { MeshTemplate } from "../integrations/api/MeshTemplate";
import { ModifierConfig } from '../modifiers/ModifierConfig';
import { MeshFactoryService } from './MeshFactoryService';
import { MeshDescriptor, DetailsDescriptor, FileDescriptor } from "../integrations/api/Config";
import { WorldItemFactoryService } from "./WorldItemFactoryService";
import { WorldParser } from "..";
import { CombinedWorldItemParser } from "../parsers/CombinedWorldItemParser";
import { FurnitureInfoParser } from "../parsers/furniture_parser/FurnitureInfoParser";
import { WorldMapToMatrixGraphConverter } from "../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { RoomSeparatorParser } from "../parsers/room_separator_parser/RoomSeparatorParser";
import { RoomInfoParser } from "../parsers/room_parser/RoomInfoParser";
import { PolygonAreaInfoParser } from "../parsers/polygon_area_parser/PolygonAreaInfoParser";
import { RootWorldItemParser } from "../parsers/RootWorldItemParser";
import { ScaleModifier } from "../modifiers/ScaleModifier";
import { SegmentBordersModifier } from "../modifiers/SegmentBordersModifier";
import { BuildHierarchyModifier } from "../modifiers/BuildHierarchyModifier";
import { AssignBordersToRoomsModifier } from "../modifiers/AssignBordersToRoomsModifier";
import { ConvertBorderPolyToLineModifier } from "../modifiers/ConvertBorderPolyToLineModifier";
import { ChangeBorderWidthModifier } from "../modifiers/ChangeBorderWidthModifier";
import { ThickenBordersModifier } from "../modifiers/ThickenBordersModifier";
import { AddOuterBorderLayerModifier } from "../modifiers/AddOuterBorderLayerModifier";
import { NormalizeBorderRotationModifier } from "../modifiers/NormalizeBorderRotationModifier";
import { ChangeFurnitureSizeModifier } from "../modifiers/ChangeFurnitureSizeModifier";
import { Polygon } from "@nightshifts.inc/geometry";
import { ModifierFactoryService } from './ModifierFactoryService';
import { ServiceFacade } from './ServiceFacade';
import { CreateMeshModifier } from '../modifiers/CreateMeshModifier';

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


export class ImporterService<M, S> {
    private services: ServiceFacade<M, S>;

    constructor(services: ServiceFacade<M, S>) {
        this.services = services;
    }

    import(worldMap: string, meshDescriptors: MeshDescriptor<any>[], worldConfig: WorldConfig = defaultWorldConfig): WorldItem[] {


        let worldItems = this.services.parserService.apply(
            worldMap,
            new CombinedWorldItemParser(
                [
                    new FurnitureInfoParser(this.services.worldItemFactoryService, worldConfig.furnitures, new WorldMapToMatrixGraphConverter()),
                    new RoomSeparatorParser(this.services.worldItemFactoryService, worldConfig.borders),
                    new RoomInfoParser(this.services.worldItemFactoryService),
                    new PolygonAreaInfoParser('empty', this.services.worldItemFactoryService),
                    new RootWorldItemParser(this.services.worldItemFactoryService)
                ]
            )
        );

        worldItems = this.services.modifierService.applyModifiers(
            worldItems,
            [
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
            ]
        );

        return worldItems;
    }
}