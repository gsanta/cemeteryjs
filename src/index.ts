import { ScaleModifier } from './modifiers/ScaleModifier';
import { AssignBordersToRoomsModifier } from './modifiers/AssignBordersToRoomsModifier';
import { SegmentBordersModifier } from './modifiers/SegmentBordersModifier';
import { BuildHierarchyModifier } from './modifiers/BuildHierarchyModifier';
import { ConvertBorderPolyToLineModifier } from './modifiers/ConvertBorderPolyToLineModifier';
import { ChangeBorderWidthModifier } from './modifiers/ChangeBorderWidthModifier';
import { ChangeFurnitureSizeModifier } from './modifiers/ChangeFurnitureSizeModifier';
import { CreateMeshModifier } from './modifiers/CreateMeshModifier';
import { CreateMockMeshModifier } from './modifiers/CreateMockMeshModifier';
import { SplitWallsIntoTwoParallelChildWalls } from './modifiers/splitWallsIntoTwoParallelChildWallsModifier';
import { ThickenBordersModifier } from './modifiers/ThickenBordersModifier';

export {WorldItem} from './WorldItem';
export {BabylonjsDemo} from './integrations/babylonjs/demo/BabylonjsDemo';
export {WorldGenerator} from './WorldGenerator';
export {BabylonWorldGenerator} from './integrations/babylonjs/BabylonWorldGenerator';
export {MockWorldGenerator} from './integrations/mock/MockWorldGenerator';
export {WorldConfig} from './services/ImporterService';
export {MeshDescriptor} from './Config';
export {FileDescriptor} from './Config';
export {ParentRoomBasedMaterialDescriptor} from './Config';
export {ShapeDescriptor} from './Config';
export {RoomDescriptor} from './Config';
export {DetailsDescriptor} from './Config';
export {BorderDimensionsDescriptor} from './Config';
export {FurnitureDimensionsDescriptor} from './Config';
export {Converter} from './WorldGenerator';

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
    SplitWallsIntoTwoParallelChildWalls: splitWallsIntoTwoParallelChildWallsModifier,
    ThickenBordersModifier
}