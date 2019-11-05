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
        let worldItems = this.services.parserService.apply(
            worldMap,
            new CombinedWorldItemBuilder(
                [
                    new FurnitureBuilder(this.services),
                    new BorderBuilder(this.services, null),
                    new RoomBuilder(this.services),
                    // new PolygonAreaParser('empty', this.services.configService.meshDescriptorMap.get('room').char, this.services),
                    new RootWorldItemBuilder(this.services.worldItemFactoryService, this.services.configService),
                    new SubareaBuilder(this.services)
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
}