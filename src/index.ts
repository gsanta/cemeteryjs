import { RoomParser } from './parsers/RoomParser';
import { FurnitureParser } from './parsers/FurnitureParser';
import { CombinedWorldItemParser } from './parsers/CombinedWorldItemParser';
import { ScaleModifier } from './modifiers/ScaleModifier';
import { AssignBordersToRoomsModifier } from './modifiers/AssignBordersToRoomsModifier';
import { SegmentBordersModifier } from './modifiers/SegmentBordersModifier';
import { RootWorldItemParser } from './parsers/RootWorldItemParser';
import { BorderParser } from './parsers/BorderParser';
import { BuildHierarchyModifier } from './modifiers/BuildHierarchyModifier';
import { PolygonAreaParser } from './parsers/PolygonAreaParser';
import { ConvertBorderPolyToLineModifier } from './modifiers/ConvertBorderPolyToLineModifier';
import { ChangeBorderWidthModifier } from './modifiers/ChangeBorderWidthModifier';
import { ChangeFurnitureSizeModifier } from './modifiers/ChangeFurnitureSizeModifier';
import { CreateMeshModifier } from './modifiers/CreateMeshModifier';
import { CreateMockMeshModifier } from './modifiers/CreateMockMeshModifier';
import { AddOuterBorderLayerModifier } from './modifiers/AddOuterBorderLayerModifier';
import { ThickenBordersModifier } from './modifiers/ThickenBordersModifier';

export {WorldItem} from './WorldItem';
export {BabylonjsDemo} from './integrations/babylonjs/demo/BabylonjsDemo';
export {WorldGenerator} from './WorldGenerator';
export {BabylonWorldGenerator} from './integrations/babylonjs/BabylonWorldGenerator';
export {WorldConfig} from './services/ImporterService';
export {MeshDescriptor} from './Config';
export {FileDescriptor} from './Config';
export {ParentRoomBasedMaterialDescriptor} from './Config';
export {ShapeDescriptor} from './Config';
export {RoomDescriptor} from './Config';
export {DetailsDescriptor} from './Config';
export {BorderDimensionsDescriptor} from './Config';
export {FurnitureDimensionsDescriptor} from './Config';

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