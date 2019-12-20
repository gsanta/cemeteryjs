import { ScaleModifier } from './world_generator/modifiers/ScaleModifier';
import { AssignBordersToRoomsModifier } from './world_generator/modifiers/AssignBordersToRoomsModifier';
import { SegmentBordersModifier } from './world_generator/modifiers/SegmentBordersModifier';
import { BuildHierarchyModifier } from './world_generator/modifiers/BuildHierarchyModifier';
import { ChangeBorderWidthModifier } from './world_generator/modifiers/ChangeBorderWidthModifier';
import { ChangeFurnitureSizeModifier } from './world_generator/modifiers/ChangeFurnitureSizeModifier';
import { FakeCreateMeshModifier } from '../test/fakes/FakeCreateMeshModifier';
import { SplitWallsIntoTwoParallelChildWallsModifier } from './world_generator/modifiers/SplitWallsIntoTwoParallelChildWallsModifier';
import { ThickenBordersModifier } from './world_generator/modifiers/ThickenBordersModifier';

export {GameObject as WorldItem} from './world_generator/services/GameObject';
export {WorldGenerator} from './WorldGenerator';
export {Converter} from './WorldGenerator';


export const transformators = {
    BuildHierarchyModifier,
    ScaleModifier,
    AssignBordersToRoomsModifier,
    SegmentBordersModifier,
    ChangeBorderWidthModifier,
    ChangeFurnitureSizeModifier,
    FakeCreateMeshModifier,
    SplitWallsIntoTwoParallelChildWallsModifier,
    ThickenBordersModifier
}