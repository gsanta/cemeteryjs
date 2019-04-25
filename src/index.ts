import { RoomInfoGenerator } from './parsing/room_parsing/RoomInfoGenerator';
import { FurnitureInfoGenerator } from './parsing/furniture_parsing/FurnitureInfoGenerator';
import { CombinedWorldItemGenerator } from './parsing/decorators/CombinedWorldItemGenerator';
import { ScalingWorldItemGeneratorDecorator } from './parsing/decorators/ScalingWorldItemGeneratorDecorator';
import { AdditionalDataConvertingWorldItemDecorator } from './parsing/decorators/AdditionalDataConvertingWorldItemDecorator';
import { BorderItemAddingWorldItemGeneratorDecorator } from './parsing/decorators/BorderItemAddingWorldItemGeneratorDecorator';
import { BorderItemSegmentingWorldItemGeneratorDecorator } from './parsing/decorators/BorderItemSegmentingWorldItemGeneratorDecorator';
import { RootWorldItemGenerator } from './parsing/RootWorldItemGenerator';
import { RoomSeparatorGenerator } from './parsing/room_separator_parsing/RoomSeparatorGenerator';
import { HierarchyBuildingWorldItemGeneratorDecorator } from './parsing/decorators/HierarchyBuildingWorldItemGeneratorDecorator';
import { StretchRoomsSoTheyJoinWorldItemGeneratorDecorator } from './parsing/decorators/StretchRoomsSoTheyJoinWorldItemGeneratorDecorator';
import { PolygonAreaInfoGenerator } from './parsing/polygon_area_parsing/PolygonAreaInfoGenerator';

export {GwmWorldMapParser, ParseOptions, defaultParseOptions} from './GwmWorldMapParser';
export {GwmWorldItem} from './model/GwmWorldItem';
export {Rectangle} from './model/Rectangle';
export {Polygon} from './model/Polygon';
export {GwmWorldItemGenerator} from './parsing/GwmWorldItemGenerator';
export {TreeNode, TreeIteratorGenerator} from './gwm_world_item/iterator/TreeIteratorGenerator';

export const generators = {
    RoomInfoGenerator,
    PolygonAreaInfoGenerator,
    FurnitureInfoGenerator,
    CombinedWorldItemGenerator,
    ScalingWorldItemGeneratorDecorator,
    AdditionalDataConvertingWorldItemDecorator,
    BorderItemAddingWorldItemGeneratorDecorator,
    BorderItemSegmentingWorldItemGeneratorDecorator,
    RootWorldItemGenerator,
    RoomSeparatorGenerator,
    HierarchyBuildingWorldItemGeneratorDecorator,
    StretchRoomsSoTheyJoinWorldItemGeneratorDecorator
}