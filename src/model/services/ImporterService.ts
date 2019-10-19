import { MeshDescriptor } from '../../Config';
import { WorldItem } from "../../WorldItem";
import { AssignBordersToRoomsModifier } from "../modifiers/AssignBordersToRoomsModifier";
import { BuildHierarchyModifier } from "../modifiers/BuildHierarchyModifier";
import { ChangeBorderWidthModifier } from "../modifiers/ChangeBorderWidthModifier";
import { ChangeFurnitureSizeModifier } from "../modifiers/ChangeFurnitureSizeModifier";
import { ConvertBorderPolyToLineModifier } from "../modifiers/ConvertBorderPolyToLineModifier";
import { CreateMeshModifier } from '../modifiers/CreateMeshModifier';
import { NormalizeBorderRotationModifier } from "../modifiers/NormalizeBorderRotationModifier";
import { SegmentBordersModifier } from "../modifiers/SegmentBordersModifier";
import { SplitWallsIntoTwoParallelChildWallsModifier } from "../modifiers/SplitWallsIntoTwoParallelChildWallsModifier";
import { ThickenBordersModifier } from "../modifiers/ThickenBordersModifier";
import { BorderParser } from "../parsers/BorderParser";
import { CombinedWorldItemParser } from "../parsers/CombinedWorldItemParser";
import { FurnitureParser } from "../parsers/FurnitureParser";
import { PolygonAreaParser } from "../parsers/PolygonAreaParser";
import { RoomParser } from "../parsers/RoomParser";
import { RootWorldItemParser } from "../parsers/RootWorldItemParser";
import { SubareaParser } from '../parsers/SubareaParser';
import { ServiceFacade } from './ServiceFacade';
import { ScaleModifier } from '../modifiers/ScaleModifier';

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
        let worldItems = this.services.parserService.apply(
            worldMap,
            new CombinedWorldItemParser(
                [
                    new FurnitureParser(this.services),
                    new BorderParser(this.services),
                    new RoomParser(this.services),
                    // new PolygonAreaParser('empty', this.services.configService.meshDescriptorMap.get('room').char, this.services),
                    new RootWorldItemParser(this.services.worldItemFactoryService, this.services.configService),
                    new SubareaParser(this.services)
                ]
            )
        );

        modNames = modNames ? modNames : [
            SegmentBordersModifier.modName,
            BuildHierarchyModifier.modName,
            ScaleModifier.modName,
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