import { RoomInfoGenerator } from './parsers/room_parsing/RoomInfoGenerator';
import { FurnitureInfoGenerator } from './parsers/furniture_parsing/FurnitureInfoGenerator';
import { CombinedWorldItemGenerator } from './parsers/CombinedWorldItemGenerator';
import { ScalingTransformator } from './transformators/ScalingTransformator';
import { AdditionalDataConvertingTransformator } from './transformators/AdditionalDataConvertingTransformator';
import { BorderItemAddingTransformator } from './transformators/BorderItemAddingTransformator';
import { BorderItemSegmentingTransformator } from './transformators/BorderItemSegmentingTransformator';
import { RootWorldItemGenerator } from './parsers/RootWorldItemGenerator';
import { RoomSeparatorGenerator } from './parsers/room_separator_parsing/RoomSeparatorGenerator';
import { HierarchyBuildingTransformator } from './transformators/HierarchyBuildingTransformator';
import { StretchRoomsSoTheyJoinTransformator } from './transformators/StretchRoomsSoTheyJoinTransformator';
import { PolygonAreaInfoGenerator } from './parsers/polygon_area_parsing/PolygonAreaInfoGenerator';

export {GwmWorldMapParser, ParseOptions, defaultParseOptions} from './GwmWorldMapParser';
export {GwmWorldItem} from './model/GwmWorldItem';
export {Rectangle} from './model/Rectangle';
export {Polygon} from './model/Polygon';
export {GwmWorldItemParser as GwmWorldItemGenerator} from './parsers/GwmWorldItemParser';
export {TreeNode, TreeIteratorGenerator} from './gwm_world_item/iterator/TreeIteratorGenerator';

// export const generators = {
//     RoomInfoGenerator,
//     PolygonAreaInfoGenerator,
//     FurnitureInfoGenerator,
//     CombinedWorldItemGenerator,
//     ScalingTransformer: ScalingWorldItemGeneratorDecorator,
//     AdditionalDataConvertingTransformer: AdditionalDataConvertingWorldItemDecorator,
//     BorderItemAddingTransformer: BorderItemAddingWorldItemGeneratorDecorator,
//     BorderItemSegmentingTransformer: BorderItemSegmentingWorldItemGeneratorDecorator,
//     RootWorldItemGenerator,
//     RoomSeparatorGenerator,
//     HierarchyBuildingTransformer: HierarchyBuildingWorldItemGeneratorDecorator,
//     StretchRoomsSoTheyJoinTransformer: StretchRoomsSoTheyJoinWorldItemGeneratorDecorator
// }