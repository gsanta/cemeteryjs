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

export {WorldItem} from './WorldItemInfo';
export {BabylonjsDemo} from './integrations/babylonjs/demo/BabylonjsDemo';
export {WorldGenerator} from './WorldGenerator';
export {BabylonWorldGenerator} from './integrations/babylonjs/BabylonWorldGenerator';
export {WorldConfig} from './services/ImporterService';
export {MeshDescriptor} from './integrations/api/Config';
export {FileDescriptor} from './integrations/api/Config';
export {ParentRoomBasedMaterialDescriptor} from './integrations/api/Config';
export {ShapeDescriptor} from './integrations/api/Config';
export {RoomDescriptor} from './integrations/api/Config';
export {DetailsDescriptor} from './integrations/api/Config';
export {BorderDimensionsDescriptor} from './integrations/api/Config';
export {FurnitureDimensionsDescriptor} from './integrations/api/Config';



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