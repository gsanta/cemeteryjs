import { RoomInfoGenerator } from './parsing/room_parsing/RoomInfoGenerator';
import { FurnitureInfoGenerator } from './parsing/furniture_parsing/FurnitureInfoGenerator';
import { CombinedWorldItemGenerator } from './parsing/decorators/CombinedWorldItemGenerator';
import { ScalingWorldItemGeneratorDecorator } from './parsing/decorators/ScalingWorldItemGeneratorDecorator';
import { AdditionalDataConvertingWorldItemDecorator } from './parsing/decorators/AdditionalDataConvertingWorldItemDecorator';
import { BorderItemAddingWorldItemGeneratorDecorator } from './parsing/decorators/BorderItemAddingWorldItemGeneratorDecorator';
import { BorderItemSegmentingWorldItemGeneratorDecorator } from './parsing/decorators/BorderItemSegmentingWorldItemGeneratorDecorator';

export {GwmWorldMapParser, ParseOptions, defaultParseOptions} from './GwmWorldMapParser';
export {GwmWorldItem} from './model/GwmWorldItem';
export {Rectangle} from './model/Rectangle';
export {Polygon} from './model/Polygon';
export {GwmWorldItemGenerator} from './parsing/GwmWorldItemGenerator';
export {TreeNode, TreeIteratorGenerator} from './gwm_world_item/iterator/TreeIteratorGenerator';

export const generators = {
    RoomInfoGenerator,
    FurnitureInfoGenerator,
    CombinedWorldItemGenerator,
    ScalingWorldItemGeneratorDecorator,
    AdditionalDataConvertingWorldItemDecorator,
    BorderItemAddingWorldItemGeneratorDecorator,
    BorderItemSegmentingWorldItemGeneratorDecorator
}