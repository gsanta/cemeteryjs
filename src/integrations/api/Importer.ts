import { WorldItem } from "../../WorldItemInfo";
import { MeshDescriptor, FileDescriptor, DetailsDescriptor } from "../babylonjs/MeshFactory";
import { MeshLoader } from './MeshLoader';
import { MeshTemplate } from "./MeshTemplate";
import { ModifierConfig } from '../../modifiers/ModifierConfig';
import { MeshFactory } from './MeshFactory';

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
    private meshLoader: MeshLoader<M, S>;
    private meshFactory: MeshFactory<M, S>;

    constructor(meshLoader: MeshLoader<M, S>, meshFactory: MeshFactory<M, S>) {
        this.meshLoader = meshLoader;
    }

    import(strWorld: string, meshDescriptors: MeshDescriptor<DetailsDescriptor>[], worldConfig: WorldConfig): Promise<WorldItem[]> {
        this.loadMeshes(<MeshDescriptor<FileDescriptor>[]> meshDescriptors.filter(desc => desc.details.name === 'file-descriptor'))
            .then((templateMap: Map<string, MeshTemplate<M, S>>) => {

                const modifierConfig: ModifierConfig<M, S> = {
                    borderTypes: worldConfig.borders,
                    realBorderTypeWidths: [],
                    realFurnitureSizes: null,
                    meshDescriptors: meshDescriptors,
                    templateMap: templateMap,

                    meshFactory: this.meshFactory
                }

                const worldItemInfoFactory = new WorldItemFactory();
                return WorldParser.createWithCustomWorldItemGenerator(
                    new CombinedWorldItemParser(
                        [
                            new FurnitureInfoParser(worldItemInfoFactory, worldConfig.furnitures, new WorldMapToMatrixGraphConverter()),
                            new RoomSeparatorParser(worldItemInfoFactory, worldConfig.borders),
                            new RoomInfoParser(worldItemInfoFactory),
                            new PolygonAreaInfoParser('empty', worldItemInfoFactory),
                            new RootWorldItemParser(worldItemInfoFactory)
                        ]
                    ),
                    [

                        new ScaleModifier({ x: worldConfig.xScale, y: worldConfig.yScale }),
                        new SegmentBordersModifier(worldItemInfoFactory, worldConfig.borders, { xScale: worldConfig.xScale, yScale: worldConfig.yScale }),
                        new BuildHierarchyModifier(),
                        new AssignBordersToRoomsModifier(worldConfig.borders),
                        new ConvertBorderPolyToLineModifier(),
                        new ChangeBorderWidthModifier([{name: 'window', width: 2}, {name: 'door', width: 2.7}]),
                        new ThickenBordersModifier(),
                        new AddOuterBorderLayerModifier(),
                        new NormalizeBorderRotationModifier(),
                        new ChangeFurnitureSizeModifier(
                            {
                                cupboard: Polygon.createRectangle(0, 0, 2, 1.5),
                                bathtub: Polygon.createRectangle(0, 0, 4.199999999999999, 2.400004970948398),
                                washbasin: Polygon.createRectangle(0, 0, 2, 1.58 + 1.5),
                                table: Polygon.createRectangle(0, 0, 3.4, 1.4 + 1.5)

                            }
                        ),
                        createMeshModifier
                    ]
                ).parse(strWorld);

            });
    }

    private loadMeshes(meshDescriptors: MeshDescriptor<FileDescriptor>[]): Promise<Map<string, MeshTemplate<M, S>>> {
        const meshPromises = meshDescriptors.map(meshDescriptor => this.meshLoader.load(meshDescriptor));
        const templateMap: Map<string, MeshTemplate<M, S>> = new Map();

        return Promise.all(meshPromises)
            .then((meshTemplates: MeshTemplate<M, S>[]) => meshTemplates.forEach(template => templateMap.set(template.type, template)))
            .then(() => templateMap);
    }
}