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
import { BorderItemWidthToRealWidthTransformator } from './transformators/BorderItemWidthToRealWidthTransformator';
import { FurnitureRealSizeTransformator } from './transformators/FurnitureRealSizeTransformator';
import { MeshCreationTransformator } from './transformators/MeshCreationTransformator';
import { MockMeshCreationTransformator } from './transformators/MockMeshCreationTransformator';
import { OuterBorderLayerAddingTransformator } from './transformators/OuterBorderLayerAddingTransformator';
import { BorderThickeningTransformator } from './transformators/BorderThickeningTransformator';
export { FileDescriptor, ShapeDescriptor, ParentRoomBasedMaterialDescriptor as ParentBasedMaterialDescriptor, RoomDescriptor } from './integrations/babylonjs/MeshFactory';
export { MeshDescriptor } from './integrations/babylonjs/MeshFactory';
export { BabylonImporter } from './integrations/babylonjs/api/BabylonImporter';
export { BabylonConverter } from './integrations/babylonjs/api/BabylonConverter';
export {WorldParser, ParseOptions, defaultParseOptions} from './WorldParser';
export {WorldItemInfo} from './WorldItemInfo';
export {WorldItemInfoFactory} from './WorldItemInfoFactory';
export {WorldItemParser} from './parsers/WorldItemParser';
export {TreeNode, TreeIteratorGenerator} from './utils/TreeIteratorGenerator';
export {Converter} from './integrations/api/Converter';
export {Importer} from './integrations/api/Importer';
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
    BorderItemWidthToRealWidthTransformator,
    FurnitureRealSizeTransformator,
    MeshCreationTransformator,
    MockMeshCreationTransformator,
    OuterBorderLayerAddingTransformator,
    BorderThickeningTransformator
}