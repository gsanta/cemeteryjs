import { WorldMapToMatrixGraphConverter } from "../parsers/reader/WorldMapToMatrixGraphConverter";
import { SplitWallsIntoTwoParallelChildWallsModifier } from "../model/modifiers/SplitWallsIntoTwoParallelChildWallsModifier";
import { AssignBordersToRoomsModifier } from "../model/modifiers/AssignBordersToRoomsModifier";
import { BuildHierarchyModifier } from "../model/modifiers/BuildHierarchyModifier";
import { ChangeBorderWidthModifier } from "../model/modifiers/ChangeBorderWidthModifier";
import { ChangeFurnitureSizeModifier } from "../model/modifiers/ChangeFurnitureSizeModifier";
import { ConvertBorderPolyToLineModifier } from "../model/modifiers/ConvertBorderPolyToLineModifier";
import { CreateMeshModifier } from '../model/modifiers/CreateMeshModifier';
import { NormalizeBorderRotationModifier } from "../model/modifiers/NormalizeBorderRotationModifier";
import { ScaleModifier } from "../model/modifiers/ScaleModifier";
import { SegmentBordersModifier } from "../model/modifiers/SegmentBordersModifier";
import { ThickenBordersModifier } from "../model/modifiers/ThickenBordersModifier";
import { CombinedWorldItemParser } from "../model/parsers/CombinedWorldItemParser";
import { FurnitureParser } from "../model/parsers/FurnitureParser";
import { PolygonAreaParser } from "../model/parsers/PolygonAreaParser";
import { RoomParser } from "../model/parsers/RoomParser";
import { BorderParser } from "../model/parsers/BorderParser";
import { RootWorldItemParser } from "../model/parsers/RootWorldItemParser";
import { WorldItem } from "../WorldItem";
import { ServiceFacade } from './ServiceFacade';
import { MeshDescriptor } from '../Config';

export interface WorldConfig {
    borders: string[];
    furnitures: string[];
    xScale: number;
    yScale: number;
    meshDescriptors: MeshDescriptor[];
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
        const furnitureTypes = this.services.configService.furnitureTypes.filter(furniture => furniture !== 'empty');

        let worldItems = this.services.parserService.apply(
            worldMap,
            new CombinedWorldItemParser(
                [
                    new FurnitureParser(this.services.worldItemFactoryService, furnitureTypes, new WorldMapToMatrixGraphConverter()),
                    new BorderParser(this.services.worldItemFactoryService, this.services.configService.borderTypes),
                    new RoomParser(this.services),
                    new PolygonAreaParser('empty', this.services),
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
            SplitWallsIntoTwoParallelChildWallsModifier.modName,
            NormalizeBorderRotationModifier.modName,
            ChangeFurnitureSizeModifier.modeName,
            CreateMeshModifier.modName
        ];

        return this.services.modifierService.applyModifiers(worldItems, modNames);
    }
}