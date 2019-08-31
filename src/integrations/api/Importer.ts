import { WorldItem } from "../../WorldItemInfo";
import { MeshLoaderService } from '../../services/MeshLoaderService';
import { MeshTemplate } from "./MeshTemplate";
import { ModifierConfig } from '../../modifiers/ModifierConfig';
import { MeshFactoryService } from '../../services/MeshFactoryService';
import { MeshDescriptor, DetailsDescriptor, FileDescriptor } from "./Config";
import { WorldItemFactoryService } from "../../services/WorldItemFactoryService";
import { WorldParser } from "../..";
import { CombinedWorldItemParser } from "../../parsers/CombinedWorldItemParser";
import { FurnitureInfoParser } from "../../parsers/furniture_parser/FurnitureInfoParser";
import { WorldMapToMatrixGraphConverter } from "../../matrix_graph/conversion/WorldMapToMatrixGraphConverter";
import { RoomSeparatorParser } from "../../parsers/room_separator_parser/RoomSeparatorParser";
import { RoomInfoParser } from "../../parsers/room_parser/RoomInfoParser";
import { PolygonAreaInfoParser } from "../../parsers/polygon_area_parser/PolygonAreaInfoParser";
import { RootWorldItemParser } from "../../parsers/RootWorldItemParser";
import { ScaleModifier } from "../../modifiers/ScaleModifier";
import { SegmentBordersModifier } from "../../modifiers/SegmentBordersModifier";
import { BuildHierarchyModifier } from "../../modifiers/BuildHierarchyModifier";
import { AssignBordersToRoomsModifier } from "../../modifiers/AssignBordersToRoomsModifier";
import { ConvertBorderPolyToLineModifier } from "../../modifiers/ConvertBorderPolyToLineModifier";
import { ChangeBorderWidthModifier } from "../../modifiers/ChangeBorderWidthModifier";
import { ThickenBordersModifier } from "../../modifiers/ThickenBordersModifier";
import { AddOuterBorderLayerModifier } from "../../modifiers/AddOuterBorderLayerModifier";
import { NormalizeBorderRotationModifier } from "../../modifiers/NormalizeBorderRotationModifier";
import { ChangeFurnitureSizeModifier } from "../../modifiers/ChangeFurnitureSizeModifier";
import { Polygon } from "@nightshifts.inc/geometry";
import { ModifierFactoryService } from '../../services/ModifierFactoryService';
import { ServiceFacade } from '../../services/ServiceFacade';

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


export class Importer<M, S> {
    private services: ServiceFacade<M, S>;

    constructor(services: ServiceFacade<M, S>) {
        this.services = services;
    }

    import(strWorld: string, meshDescriptors: MeshDescriptor<any>[], worldConfig: WorldConfig = defaultWorldConfig): Promise<WorldItem[]> {


        this.services.modifierService.applyModifiers()

        return null;
        // this.loadMeshes(<MeshDescriptor<FileDescriptor>[]> meshDescriptors.filter(desc => desc.details.name === 'file-descriptor'))
        //     .then((templateMap: Map<string, MeshTemplate<M, S>>) => {

        //         const modifierConfig: ModifierConfig<M, S> = {
        //             borderTypes: worldConfig.borders,
        //             realBorderTypeWidths: [],
        //             realFurnitureSizes: null,
        //             meshDescriptors: meshDescriptors,
        //             templateMap: templateMap,

        //             meshFactory: this.meshFactory
        //         }

        //         const worldItemInfoFactory = new WorldItemFactory();
        //         return WorldParser.createWithCustomWorldItemGenerator(
        //             new CombinedWorldItemParser(
        //                 [
        //                     new FurnitureInfoParser(worldItemInfoFactory, worldConfig.furnitures, new WorldMapToMatrixGraphConverter()),
        //                     new RoomSeparatorParser(worldItemInfoFactory, worldConfig.borders),
        //                     new RoomInfoParser(worldItemInfoFactory),
        //                     new PolygonAreaInfoParser('empty', worldItemInfoFactory),
        //                     new RootWorldItemParser(worldItemInfoFactory)
        //                 ]
        //             ),
        //             [

        //                 new ScaleModifier({ x: worldConfig.xScale, y: worldConfig.yScale }),
        //                 new SegmentBordersModifier(worldItemInfoFactory, worldConfig.borders, { xScale: worldConfig.xScale, yScale: worldConfig.yScale }),
        //                 new BuildHierarchyModifier(),
        //                 new AssignBordersToRoomsModifier(worldConfig.borders),
        //                 new ConvertBorderPolyToLineModifier(),
        //                 new ChangeBorderWidthModifier([{name: 'window', width: 2}, {name: 'door', width: 2.7}]),
        //                 new ThickenBordersModifier(),
        //                 new AddOuterBorderLayerModifier(),
        //                 new NormalizeBorderRotationModifier(),
        //                 new ChangeFurnitureSizeModifier(
        //                     {
        //                         cupboard: Polygon.createRectangle(0, 0, 2, 1.5),
        //                         bathtub: Polygon.createRectangle(0, 0, 4.199999999999999, 2.400004970948398),
        //                         washbasin: Polygon.createRectangle(0, 0, 2, 1.58 + 1.5),
        //                         table: Polygon.createRectangle(0, 0, 3.4, 1.4 + 1.5)

        //                     }
        //                 ),
        //                 createMeshModifier
        //             ]
        //         ).parse(strWorld);

        //     });
    }

    private loadMeshes(meshDescriptors: MeshDescriptor<FileDescriptor>[]): Promise<Map<string, MeshTemplate<M, S>>> {
        const meshPromises = meshDescriptors.map(meshDescriptor => this.meshLoader.load(meshDescriptor));
        const templateMap: Map<string, MeshTemplate<M, S>> = new Map();

        return Promise.all(meshPromises)
            .then((meshTemplates: MeshTemplate<M, S>[]) => meshTemplates.forEach(template => templateMap.set(template.type, template)))
            .then(() => templateMap);
    }
}