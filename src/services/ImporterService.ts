import { WorldMapToMatrixGraphConverter } from "../parsers/reader/WorldMapToMatrixGraphConverter";
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
import { FurnitureParser } from "../parsers/FurnitureParser";
import { PolygonAreaParser } from "../parsers/PolygonAreaParser";
import { RoomParser } from "../parsers/RoomParser";
import { BorderParser } from "../parsers/BorderParser";
import { RootWorldItemParser } from "../parsers/RootWorldItemParser";
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
    furnitures: ['player', 'cupboard', 'table', 'bathtub', 'washbasin', 'bed', 'chair', 'portal'],
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
                    new RoomParser(this.services.worldItemFactoryService),
                    new PolygonAreaParser('empty', this.services.worldItemFactoryService),
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