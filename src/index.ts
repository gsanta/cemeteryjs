import { RoomInfoParser } from './parsers/room_parser/RoomInfoParser';
import { FurnitureInfoParser } from './parsers/furniture_parser/FurnitureInfoParser';
import { CombinedWorldItemParser } from './parsers/CombinedWorldItemParser';
import { ScaleModifier } from './modifiers/ScaleModifier';
import { AssignBordersToRoomsModifier } from './modifiers/AssignBordersToRoomsModifier';
import { SegmentBordersModifier } from './modifiers/SegmentBordersModifier';
import { RootWorldItemParser } from './parsers/RootWorldItemParser';
import { RoomSeparatorParser } from './parsers/room_separator_parser/RoomSeparatorParser';
import { BuildHierarchyModifier } from './modifiers/BuildHierarchyModifier';
import { PolygonAreaInfoParser } from './parsers/polygon_area_parser/PolygonAreaInfoParser';
import { ConvertBorderPolyToLineModifier } from './modifiers/ConvertBorderPolyToLineModifier';
import { ChangeBorderWidthModifier } from './modifiers/ChangeBorderWidthModifier';
import { ChangeFurnitureSizeModifier } from './modifiers/ChangeFurnitureSizeModifier';
import { CreateMeshModifier } from './modifiers/CreateMeshModifier';
import { CreateMockMeshModifier } from './modifiers/CreateMockMeshModifier';
import { AddOuterBorderLayerModifier } from './modifiers/AddOuterBorderLayerModifier';
import { ThickenBordersModifier } from './modifiers/ThickenBordersModifier';
export { BabylonImporter } from './integrations/babylonjs/api/BabylonImporter';
export { BabylonConverter } from './integrations/babylonjs/api/BabylonConverter';
export {WorldParser, ParseOptions, defaultParseOptions} from './WorldParser';
export {WorldItem as WorldItemInfo} from './WorldItemInfo';
export {WorldItemFactoryService as WorldItemInfoFactory} from './services/WorldItemFactoryService';
export {Parser as WorldItemParser} from './parsers/Parser';
export {TreeNode, TreeIteratorGenerator} from './utils/TreeIteratorGenerator';
export {ConverterService as Converter} from './services/ConverterService';
export {ImporterService as Importer} from './services/ImporterService';
export {BabylonjsDemo} from './integrations/babylonjs/demo/BabylonjsDemo';


export const parsers = {
    RoomInfoParser,
    PolygonAreaInfoParser,
    FurnitureInfoParser,
    CombinedWorldItemParser,
    RootWorldItemParser,
    RoomSeparatorParser,
}

export const transformators = {
    BuildHierarchyModifier,
    ScaleModifier,
    AssignBordersToRoomsModifier,
    SegmentBordersModifier,
    ConvertBorderPolyToLineModifier,
    ChangeBorderWidthModifier,
    ChangeFurnitureSizeModifier,
    CreateMeshModifier,
    CreateMockMeshModifier,
    AddOuterBorderLayerModifier,
    ThickenBordersModifier
}