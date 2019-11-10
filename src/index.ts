import { ScaleModifier } from './model/modifiers/ScaleModifier';
import { AssignBordersToRoomsModifier } from './model/modifiers/AssignBordersToRoomsModifier';
import { SegmentBordersModifier } from './model/modifiers/SegmentBordersModifier';
import { BuildHierarchyModifier } from './model/modifiers/BuildHierarchyModifier';
import { ChangeBorderWidthModifier } from './model/modifiers/ChangeBorderWidthModifier';
import { ChangeFurnitureSizeModifier } from './model/modifiers/ChangeFurnitureSizeModifier';
import { CreateMeshModifier } from './model/modifiers/CreateMeshModifier';
import { CreateMockMeshModifier } from './model/modifiers/CreateMockMeshModifier';
import { SplitWallsIntoTwoParallelChildWallsModifier } from './model/modifiers/SplitWallsIntoTwoParallelChildWallsModifier';
import { ThickenBordersModifier } from './model/modifiers/ThickenBordersModifier';

export {WorldItem} from './WorldItem';
export {WorldGenerator} from './WorldGenerator';
export {BabylonWorldGenerator} from './integrations/babylonjs/BabylonWorldGenerator';
export {MockWorldGenerator} from './integrations/mock/MockWorldGenerator';
export {WorldConfig} from './model/services/ImporterService';
export {Converter} from './WorldGenerator';


export const transformators = {
    BuildHierarchyModifier,
    ScaleModifier,
    AssignBordersToRoomsModifier,
    SegmentBordersModifier,
    ChangeBorderWidthModifier,
    ChangeFurnitureSizeModifier,
    CreateMeshModifier,
    CreateMockMeshModifier,
    SplitWallsIntoTwoParallelChildWallsModifier,
    ThickenBordersModifier
}