import { RoomInfoGenerator } from './parsing/room_parsing/RoomInfoGenerator';
import { FurnitureInfoGenerator } from './parsing/furniture_parsing/FurnitureInfoGenerator';
import { CombinedWorldItemGenerator } from './parsing/decorators/CombinedWorldItemGenerator';
import { ScalingWorldItemGeneratorDecorator } from './parsing/decorators/ScalingWorldItemGeneratorDecorator';
import { AdditionalDataConvertingWorldItemDecorator } from './parsing/decorators/AdditionalDataConvertingWorldItemDecorator';

export {WorldMapParser, ParseOptions, defaultParseOptions} from './WorldMapParser';
export {WorldItem} from './model/WorldItem';
export {Rectangle} from './model/Rectangle';
export {Polygon} from './model/Polygon';
export {WorldItemGenerator} from './parsing/WorldItemGenerator';

export const generators = {
    RoomInfoGenerator,
    FurnitureInfoGenerator,
    CombinedWorldItemGenerator,
    ScalingWorldItemGeneratorDecorator,
    AdditionalDataConvertingWorldItemDecorator
}