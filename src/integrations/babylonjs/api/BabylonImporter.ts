import { Polygon } from '@nightshifts.inc/geometry';
import { SegmentBordersModifier } from '../../../modifiers/SegmentBordersModifier';
import { ChangeFurnitureSizeModifier } from '../../../modifiers/ChangeFurnitureSizeModifier';
import { ChangeBorderWidthModifier } from '../../../modifiers/ChangeBorderWidthModifier';
import { ConvertBorderPolyToLineModifier } from '../../../modifiers/ConvertBorderPolyToLineModifier';
import { AssignBordersToRoomsModifier } from '../../../modifiers/AssignBordersToRoomsModifier';
import { BuildHierarchyModifier } from '../../../modifiers/BuildHierarchyModifier';
import { ScaleModifier } from '../../../modifiers/ScaleModifier';
import { RootWorldItemParser } from '../../../parsers/RootWorldItemParser';
import { PolygonAreaInfoParser } from '../../../parsers/polygon_area_parser/PolygonAreaInfoParser';
import { RoomInfoParser } from '../../../parsers/room_parser/RoomInfoParser';
import { RoomSeparatorParser } from '../../../parsers/room_separator_parser/RoomSeparatorParser';
import { FurnitureInfoParser } from '../../../parsers/furniture_parser/FurnitureInfoParser';
import { CreateMeshModifier } from '../../../modifiers/CreateMeshModifier';
import { WorldParser } from '../../../WorldParser';
import { WorldItemFactoryService } from '../../../services/WorldItemFactoryService';
import { CombinedWorldItemParser } from '../../../parsers/CombinedWorldItemParser';
import { WorldMapToMatrixGraphConverter } from '../../../matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { WorldItem } from '../../../WorldItemInfo';
import { ImporterService, defaultWorldConfig, WorldConfig } from '../../../services/ImporterService';
import { Scene, Skeleton, Mesh } from 'babylonjs';
import { BabylonMeshLoader } from './BabylonMeshLoader';
import { NormalizeBorderRotationModifier } from '../../../modifiers/NormalizeBorderRotationModifier';
import { ThickenBordersModifier } from '../../../modifiers/ThickenBordersModifier';
import { AddOuterBorderLayerModifier } from '../../../modifiers/AddOuterBorderLayerModifier';
import { BabylonMeshFactory } from './BabylonMeshFactory';
import { MeshDescriptor } from '../../api/Config';
import { MeshFactoryService } from '../../../services/MeshFactoryService';
import { ModifierFactoryService } from '../../../services/ModifierFactoryService';

export class BabylonImporter extends ImporterService<Mesh, Skeleton> {
    // private meshFactory: BabylonMeshFactory;
    // private meshLoader: BabylonMeshLoader;

    constructor(scene: Scene, meshFactory: BabylonMeshFactory, modifierFactory: ModifierFactoryService) {
        super(new BabylonMeshLoader(scene), meshFactory);

        meshFactory.
    }

    // constructor(scene: Scene, meshFactory: BabylonMeshFactory = new BabylonMeshFactory(scene), meshLoader: BabylonMeshLoader = new BabylonMeshLoader(scene)) {
    //     super();
    //     this.meshFactory = meshFactory;
    //     this.meshLoader = meshLoader;
    // }

    import(strWorld: string, modelTypeDescription: MeshDescriptor[], worldConfig = defaultWorldConfig): Promise<WorldItem[]> {
        return this.parse(strWorld, worldConfig, modelTypeDescription);
    }

    // private parse(strWorld: string, worldConfig: WorldConfig, modelTypeDescription: MeshDescriptor[]): Promise<WorldItem[]> {

    //     const createMeshModifier = new CreateMeshModifier(this.meshLoader, this.meshFactory);

    //     return createMeshModifier.prepareMeshTemplates(modelTypeDescription)
    //     .then(() => {
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
    // }
}
