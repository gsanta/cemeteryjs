import { RoomInfoParser } from './parsers/room_parser/RoomInfoParser';
import { FurnitureInfoParser } from './parsers/furniture_parser/FurnitureInfoParser';
import { CombinedWorldItemParser } from './parsers/CombinedWorldItemParser';
import { ScalingTransformator } from './transformators/ScalingTransformator';
import { AdditionalDataConvertingTransformator } from './transformators/AdditionalDataConvertingTransformator';
import { BorderItemAddingTransformator } from './transformators/BorderItemAddingTransformator';
import { BorderItemSegmentingTransformator } from './transformators/BorderItemSegmentingTransformator';
import { RootWorldItemParser } from './parsers/RootWorldItemParser';
import { RoomSeparatorParser } from './parsers/room_separator_parser/RoomSeparatorParser';
import { HierarchyBuildingTransformator } from './transformators/HierarchyBuildingTransformator';
import { StretchRoomsSoTheyJoinTransformator } from './transformators/StretchRoomsSoTheyJoinTransformator';
import { PolygonAreaInfoParser } from './parsers/polygon_area_parser/PolygonAreaInfoParser';

export {GwmWorldMapParser, ParseOptions, defaultParseOptions} from './GwmWorldMapParser';
export {GwmWorldItem} from './model/GwmWorldItem';
export {Rectangle} from './model/Rectangle';
export {Polygon} from './model/Polygon';
export {GwmWorldItemParser as GwmWorldItemGenerator} from './parsers/GwmWorldItemParser';
export {TreeNode, TreeIteratorGenerator} from './gwm_world_item/iterator/TreeIteratorGenerator';

export const parsers = {
    RoomInfoParser,
    PolygonAreaInfoParser,
    FurnitureInfoParser,
    CombinedWorldItemParser,
    RootWorldItemParser,
    RoomSeparatorParser,
}

export const transformators = {
    HierarchyBuildingTransformator,
    ScalingTransformator,
    AdditionalDataConvertingTransformator,
    BorderItemAddingTransformator,
    BorderItemSegmentingTransformator,
    StretchRoomsSoTheyJoinTransformator
}