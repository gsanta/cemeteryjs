import { Polygon } from '@nightshifts.inc/geometry';
import { BorderItemSegmentingTransformator } from '../../../transformators/BorderItemSegmentingTransformator';
import { FurnitureRealSizeTransformator } from '../../../transformators/FurnitureRealSizeTransformator';
import { BorderItemWidthToRealWidthTransformator } from '../../../transformators/BorderItemWidthToRealWidthTransformator';
import { BorderItemsToLinesTransformator } from '../../../transformators/BorderItemsToLinesTransformator';
import { BorderItemAddingTransformator } from '../../../transformators/BorderItemAddingTransformator';
import { HierarchyBuildingTransformator } from '../../../transformators/HierarchyBuildingTransformator';
import { ScalingTransformator } from '../../../transformators/ScalingTransformator';
import { RootWorldItemParser } from '../../../parsers/RootWorldItemParser';
import { PolygonAreaInfoParser } from '../../../parsers/polygon_area_parser/PolygonAreaInfoParser';
import { RoomInfoParser } from '../../../parsers/room_parser/RoomInfoParser';
import { RoomSeparatorParser } from '../../../parsers/room_separator_parser/RoomSeparatorParser';
import { FurnitureInfoParser } from '../../../parsers/furniture_parser/FurnitureInfoParser';
import { MeshCreationTransformator } from '../../../transformators/MeshCreationTransformator';
import { defaultParseOptions, WorldParser } from '../../../WorldParser';
import { WorldItemInfoFactory } from '../../../WorldItemInfoFactory';
import { CombinedWorldItemParser } from '../../../parsers/CombinedWorldItemParser';
import { WorldMapToMatrixGraphConverter } from '../../../matrix_graph/conversion/WorldMapToMatrixGraphConverter';
import { WorldItemInfo } from '../../../WorldItemInfo';
import { Importer, defaultWorldConfig, WorldConfig } from '../../api/Importer';
import { Scene } from 'babylonjs';
import { MeshFactory, MeshDescriptor } from '../MeshFactory';
import { MeshLoader } from '../MeshLoader';

export class BabylonImporter implements Importer {
    private meshFactory: MeshFactory;
    private meshLoader: MeshLoader;

    constructor(scene: Scene, meshFactory: MeshFactory = new MeshFactory(scene), meshLoader: MeshLoader = new MeshLoader(scene)) {
        this.meshFactory = meshFactory;
        this.meshLoader = meshLoader;
    }

    import(strWorld: string, modelTypeDescription: MeshDescriptor[], worldConfig = defaultWorldConfig): Promise<WorldItemInfo[]> {
        return this.parse(strWorld, worldConfig, modelTypeDescription);
    }

    private parse(strWorld: string, worldConfig: WorldConfig, modelTypeDescription: MeshDescriptor[]): Promise<WorldItemInfo[]> {

        const meshCreationTransformator = new MeshCreationTransformator(this.meshLoader, this.meshFactory);

        return meshCreationTransformator.prepareMeshTemplates(modelTypeDescription)
        .then(() => {
            const worldItemInfoFactory = new WorldItemInfoFactory();
            return WorldParser.createWithCustomWorldItemGenerator(
                new CombinedWorldItemParser(
                    [
                        new FurnitureInfoParser(worldItemInfoFactory, worldConfig.furnitures, new WorldMapToMatrixGraphConverter()),
                        new RoomSeparatorParser(worldItemInfoFactory, worldConfig.borders),
                        new RoomInfoParser(worldItemInfoFactory),
                        new PolygonAreaInfoParser(worldItemInfoFactory, 'empty', '-'),
                        new RootWorldItemParser(worldItemInfoFactory)
                    ]
                ),
                [

                    new ScalingTransformator({ x: worldConfig.xScale, y: worldConfig.yScale }),
                    new BorderItemSegmentingTransformator(worldItemInfoFactory, ['wall', 'door', 'window'], { xScale: worldConfig.xScale, yScale: worldConfig.yScale }),
                    new HierarchyBuildingTransformator(),
                    new BorderItemAddingTransformator(['wall', 'door', 'window']),
                    new BorderItemsToLinesTransformator({ xScale: worldConfig.xScale, yScale: worldConfig.yScale }),
                    new BorderItemWidthToRealWidthTransformator([{name: 'window', width: 2}, {name: 'door', width: 2.7}]),
                    new FurnitureRealSizeTransformator(
                        {
                            cupboard: Polygon.createRectangle(0, 0, 2, 1.5),
                            bathtub: Polygon.createRectangle(0, 0, 4.199999999999999, 2.400004970948398),
                            washbasin: Polygon.createRectangle(0, 0, 2, 1.58 + 1.5),
                            table: Polygon.createRectangle(0, 0, 3.4, 1.4 + 1.5)

                        }
                    ),
                    meshCreationTransformator
                ]
            ).parse(strWorld);
        });
    }
}
